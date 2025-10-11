"use client";

import React, { useState } from "react";
import { NavMenu } from "@/components/nav-bar";
import { MobileNav } from "@/components/mobile-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getNavByRole, AGENT_NAV, COLLABORATOR_NAV, ADMIN_NAV } from "@/config/navigation";
import { Users, Building2, ShieldCheck } from "lucide-react";

/**
 * NavigationDemo Component
 * 
 * Visual demonstration of the role-based navigation system.
 * Shows how navigation adapts for different user roles.
 * 
 * Usage: Add this to a test/demo page
 */
export default function NavigationDemo() {
  const [selectedRole, setSelectedRole] = useState("COLLABORATOR");

  const roleInfo = {
    AGENT: {
      icon: Users,
      color: "blue",
      description: "Agents sportifs gérant leurs athlètes",
      features: ["Gestion d'athlètes", "Analytics", "Messages marques"],
    },
    COLLABORATOR: {
      icon: Building2,
      color: "green",
      description: "Marques et organisations cherchant des talents",
      features: ["Explorer athlètes", "Suivis", "Organisations", "Contrats"],
    },
    ADMIN: {
      icon: ShieldCheck,
      color: "purple",
      description: "Administrateurs avec accès complet",
      features: ["Tous les utilisateurs", "Gestion système", "Paiements", "Analytics globales"],
    },
  };

  const navItems = getNavByRole(selectedRole);
  const info = roleInfo[selectedRole];
  const Icon = info.icon;

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Navigation Data Binding</h1>
        <p className="text-muted-foreground">
          Démonstration du système de navigation adaptatif basé sur les rôles utilisateur
        </p>
      </div>

      {/* Role Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {Object.entries(roleInfo).map(([role, { icon: RoleIcon, color, description }]) => (
          <Card
            key={role}
            className={`cursor-pointer transition-all ${
              selectedRole === role
                ? "border-primary shadow-lg scale-105"
                : "hover:border-primary/50"
            }`}
            onClick={() => setSelectedRole(role)}
          >
            <CardHeader>
              <div className="flex items-center gap-2">
                <RoleIcon className="h-5 w-5" />
                <CardTitle className="text-xl">{role}</CardTitle>
                {selectedRole === role && <Badge>Sélectionné</Badge>}
              </div>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Navigation Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Desktop Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Navigation Desktop</CardTitle>
            <CardDescription>
              Menu horizontal affiché sur desktop
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg">
              <NavMenu role={selectedRole} />
            </div>
          </CardContent>
        </Card>

        {/* Mobile Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Navigation Mobile</CardTitle>
            <CardDescription>
              Menu drawer pour mobile/tablette
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg">
              <MobileNav role={selectedRole} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role Details */}
      <Card className="mt-8">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Icon className="h-6 w-6" />
            <CardTitle>Détails du rôle {selectedRole}</CardTitle>
          </div>
          <CardDescription>{info.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="items" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="items">Items de navigation</TabsTrigger>
              <TabsTrigger value="features">Fonctionnalités</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>

            <TabsContent value="items" className="space-y-4">
              <div className="grid gap-2">
                {navItems.map((item, index) => (
                  <div
                    key={item.href}
                    className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                  >
                    {item.icon && <item.icon className="h-5 w-5 text-primary" />}
                    <div className="flex-1">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.href}
                      </div>
                    </div>
                    <Badge variant="outline">{index + 1}</Badge>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="features">
              <div className="space-y-2">
                {info.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Badge variant="secondary">{index + 1}</Badge>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="code">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Import</h4>
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`import { NavMenu } from '@/components/nav-bar';`}
                  </pre>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Usage</h4>
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`<NavMenu role="${selectedRole}" />`}
                  </pre>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Résultat</h4>
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`// ${navItems.length} items de navigation
${navItems.map(item => `// - ${item.label} (${item.href})`).join('\n')}`}
                  </pre>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Navigation AGENT</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{AGENT_NAV.length}</div>
            <p className="text-sm text-muted-foreground">items de menu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Navigation COLLABORATOR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{COLLABORATOR_NAV.length}</div>
            <p className="text-sm text-muted-foreground">items de menu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Navigation ADMIN</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{ADMIN_NAV.length}</div>
            <p className="text-sm text-muted-foreground">items de menu</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
