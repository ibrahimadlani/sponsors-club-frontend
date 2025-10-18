# Backend API Specification - Available Agents Endpoint

## 📋 Overview

This document specifies the requirements for the new endpoint that allows collaborators to retrieve available agents/athletes for contract creation.

## 🎯 Endpoint Details

**Endpoint**: `GET /api/contracts/available-agents/`

**Purpose**: Provide collaborators with a list of athletes who have agents and can be included in contracts

**Authentication**: Required

**Permissions**: `IsAuthenticated` + `IsCollaborator` (or `IsAdmin`)

## 📥 Request

### Headers
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Query Parameters (Optional)

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `search` | string | Search by athlete name | `?search=Dupont` |
| `sport_id` | UUID | Filter by sport | `?sport_id=uuid` |
| `country` | string | Filter by country | `?country=France` |
| `page` | integer | Page number (if paginated) | `?page=2` |
| `page_size` | integer | Items per page | `?page_size=50` |

### Example Request
```bash
GET /api/contracts/available-agents/?sport_id=uuid&country=France
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

## 📤 Response

### Success Response (200 OK)

```json
{
  "count": 37,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "0a41790b-b62b-42c9-9466-d95cdd4270c4",
      "full_name": "Alice Dupont",
      "agent": "9a6970e1-45de-4078-803a-902639953069",
      "sport": {
        "id": "cadfecda-b5cb-40e9-8b69-be4c2d0bbc9c",
        "name": "Athletics",
        "slug": "athletics",
        "emoji": "🏃"
      }
    },
    {
      "id": "6d0f6dc3-cbbc-43e8-ad65-1b9a31f65ed1",
      "full_name": "Bruno Martin",
      "agent": "06ea05c6-aa8f-4a81-9fca-e82763b4d6d0",
      "sport": {
        "id": "883696a4-2fa7-45fc-9e76-e731631e16d3",
        "name": "Football",
        "slug": "football",
        "emoji": "⚽"
      }
    }
  ]
}
```

### Error Responses

#### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

#### 403 Forbidden
```json
{
  "detail": "You do not have permission to perform this action."
}
```

## 💻 Django Implementation

### 1. View (`views/contracts.py`)

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from myapp.models import Athlete
from myapp.serializers import AthleteMinimalSerializer
from myapp.permissions import IsCollaboratorOrAdmin


class AvailableAgentsPagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 100


class AvailableAgentsView(APIView):
    """
    Retrieve list of athletes with agents for contract creation.
    
    This endpoint is accessible to collaborators who need to create
    contracts with athletes. Only athletes who have a valid agent
    are returned.
    
    Permissions:
    - Authenticated
    - Role: COLLABORATOR or ADMIN
    """
    permission_classes = [IsAuthenticated, IsCollaboratorOrAdmin]
    pagination_class = AvailableAgentsPagination
    
    def get(self, request):
        # Base queryset: athletes with agents only
        queryset = Athlete.objects.filter(
            agent__isnull=False
        ).select_related('agent', 'sport')
        
        # Search filter
        search = request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(full_name__icontains=search) |
                Q(slug__icontains=search)
            )
        
        # Sport filter
        sport_id = request.query_params.get('sport_id')
        if sport_id:
            queryset = queryset.filter(sport_id=sport_id)
        
        # Country filter
        country = request.query_params.get('country')
        if country:
            queryset = queryset.filter(country__iexact=country)
        
        # Order by name
        queryset = queryset.order_by('full_name')
        
        # Pagination
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, request)
        
        if page is not None:
            serializer = AthleteMinimalSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        
        # No pagination
        serializer = AthleteMinimalSerializer(queryset, many=True)
        return Response(serializer.data)
```

### 2. Permission (`permissions.py`)

```python
from rest_framework.permissions import BasePermission


class IsCollaboratorOrAdmin(BasePermission):
    """
    Custom permission to only allow collaborators or admins.
    """
    
    def has_permission(self, request, view):
        # Must be authenticated
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Admin/staff always allowed
        if request.user.is_staff or request.user.is_superuser:
            return True
        
        # Check if user has COLLABORATOR role
        return hasattr(request.user, 'role') and request.user.role == 'COLLABORATOR'
```

### 3. Serializer (`serializers/athlete.py`)

```python
from rest_framework import serializers
from myapp.models import Athlete, Sport


class SportMinimalSerializer(serializers.ModelSerializer):
    """Minimal sport data for athlete listing"""
    
    class Meta:
        model = Sport
        fields = ['id', 'name', 'slug', 'emoji']


class AthleteMinimalSerializer(serializers.ModelSerializer):
    """
    Minimal athlete data for contract creation.
    Only includes necessary fields, no sensitive data.
    """
    sport = SportMinimalSerializer(read_only=True)
    
    class Meta:
        model = Athlete
        fields = [
            'id',
            'full_name',
            'agent',  # UUID of the agent
            'sport'
        ]
        read_only_fields = fields
```

### 4. URL Configuration (`urls.py`)

```python
from django.urls import path
from myapp.views.contracts import AvailableAgentsView

urlpatterns = [
    # ... existing contract URLs
    path('contracts/available-agents/', AvailableAgentsView.as_view(), name='available-agents'),
]
```

## 🧪 Testing

### Unit Tests (`tests/test_available_agents.py`)

```python
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from myapp.models import User, Athlete, Agent, Sport


class AvailableAgentsTestCase(TestCase):
    
    def setUp(self):
        self.client = APIClient()
        
        # Create users
        self.collaborator = User.objects.create_user(
            email='collab@test.com',
            password='test123',
            role='COLLABORATOR'
        )
        self.agent_user = User.objects.create_user(
            email='agent@test.com',
            password='test123',
            role='AGENT'
        )
        
        # Create sport
        self.sport = Sport.objects.create(
            name='Football',
            slug='football',
            emoji='⚽'
        )
        
        # Create agent
        self.agent = Agent.objects.create(
            user=self.agent_user,
            name='Test Agent'
        )
        
        # Create athletes
        self.athlete_with_agent = Athlete.objects.create(
            full_name='Alice Dupont',
            sport=self.sport,
            agent=self.agent
        )
        self.athlete_without_agent = Athlete.objects.create(
            full_name='Bob Martin',
            sport=self.sport,
            agent=None
        )
    
    def test_collaborator_can_access(self):
        """Test that collaborators can access the endpoint"""
        self.client.force_authenticate(user=self.collaborator)
        response = self.client.get('/api/contracts/available-agents/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
    
    def test_only_athletes_with_agents_returned(self):
        """Test that only athletes with agents are returned"""
        self.client.force_authenticate(user=self.collaborator)
        response = self.client.get('/api/contracts/available-agents/')
        
        results = response.data['results']
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['full_name'], 'Alice Dupont')
    
    def test_unauthenticated_access_denied(self):
        """Test that unauthenticated users cannot access"""
        response = self.client.get('/api/contracts/available-agents/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_agent_cannot_access(self):
        """Test that regular agents cannot access (only collaborators)"""
        self.client.force_authenticate(user=self.agent_user)
        response = self.client.get('/api/contracts/available-agents/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_search_filter(self):
        """Test search functionality"""
        self.client.force_authenticate(user=self.collaborator)
        response = self.client.get('/api/contracts/available-agents/?search=Alice')
        
        results = response.data['results']
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['full_name'], 'Alice Dupont')
    
    def test_sport_filter(self):
        """Test sport filter"""
        self.client.force_authenticate(user=self.collaborator)
        response = self.client.get(
            f'/api/contracts/available-agents/?sport_id={self.sport.id}'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
```

## 📊 Database Queries

### Optimized Query
```python
# Use select_related to avoid N+1 queries
Athlete.objects.filter(
    agent__isnull=False
).select_related('agent', 'sport')
```

### Expected SQL
```sql
SELECT 
    athlete.id,
    athlete.full_name,
    athlete.agent_id,
    sport.id,
    sport.name,
    sport.slug,
    sport.emoji
FROM athlete
INNER JOIN sport ON athlete.sport_id = sport.id
WHERE athlete.agent_id IS NOT NULL
ORDER BY athlete.full_name;
```

## 🚀 Deployment Checklist

- [ ] Create migration for any model changes
- [ ] Implement view with proper permissions
- [ ] Create serializer with minimal fields
- [ ] Add URL route
- [ ] Write unit tests (minimum 80% coverage)
- [ ] Test with Postman/curl
- [ ] Update API documentation
- [ ] Add logging for access tracking
- [ ] Performance test with > 1000 athletes
- [ ] Deploy to staging
- [ ] Test with frontend integration
- [ ] Deploy to production

## 📈 Performance Considerations

1. **Indexing**: Ensure `agent_id` is indexed in Athlete model
2. **Caching**: Consider Redis cache for 5-10 minutes
3. **Pagination**: Default 50 items per page, max 100
4. **Select Related**: Always use `select_related('agent', 'sport')`
5. **Query Optimization**: Monitor with Django Debug Toolbar

## 🔒 Security Considerations

1. **Authentication**: JWT token required
2. **Authorization**: Only COLLABORATOR or ADMIN roles
3. **Rate Limiting**: Consider 100 requests per minute per user
4. **Data Filtering**: No sensitive personal data (email, phone, address)
5. **Audit Log**: Log all access attempts

## 📞 Contact

For questions or issues with this specification:
- Frontend Team: [GitHub Issues](https://github.com/your-org/frontend/issues)
- Backend Team: [GitHub Issues](https://github.com/your-org/backend/issues)
