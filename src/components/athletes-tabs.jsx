import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TAB_TRIGGER_CLASSNAME =
  "flex-col items-center justify-center gap-2 text-xs font-medium opacity-75 hover:opacity-100";

const TAB_ITEMS = [
  { value: "olympics", label: "Olympiques", icon: "olympics" },
  { value: "top-performers", label: "Top Performers", icon: "laurelwreath" },
  { value: "trends", label: "Tendances", icon: "fire" },
  { value: "prospects", label: "Espoirs", icon: "plant" },
  { type: "divider" },
  { value: "football", label: "Football", icon: "football" },
  { value: "basketball", label: "Basketball", icon: "basketball" },
  { value: "tennis", label: "Tennis", icon: "tennis" },
  { value: "cycling", label: "Cyclisme", icon: "bike" },
  { value: "handball", label: "Handball", icon: "handball" },
  { value: "martial-arts", label: "Arts Martiaux", icon: "martialsarts" },
  { value: "athletics", label: "Athlétisme", icon: "athletics" },
  { value: "ski", label: "Ski", icon: "ski" },
  { value: "snowboard", label: "Snowboard", icon: "snowboard" },
  { value: "fencing", label: "Escrime", icon: "fencing" },
  { value: "swimming", label: "Natation", icon: "swimming" },
  { value: "canoe", label: "Canoë", icon: "canoe" },
  { value: "surf", label: "Surf", icon: "surf" },
  { value: "weightlifting", label: "Haltérophilie", icon: "weightlifting" },
  { value: "motorsport", label: "Moto", icon: "moto" },
];

const AthletesTabs = () => {
  const { theme, resolvedTheme } = useTheme();
  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const getImagePath = (filename) => {
    if (!filename) {
      throw new Error("Filename is required");
    }

    const basePath = "/images/sports";
    const themeDirectory = currentTheme === "dark" ? "white" : "black";

    return `${basePath}/${themeDirectory}/${filename}.png`;
  };

  return (
    <Tabs defaultValue="olympics" className="max-w-screen overflow-x-auto">
      <TabsList className="flex items-center justify-center gap-10 p-3">
        {TAB_ITEMS.map((item, index) =>
          item.type === "divider" ? (
            <div key={`divider-${index}`} className="h-12 w-px border-r" aria-hidden="true" />
          ) : (
            <TabsTrigger key={item.value} value={item.value} className={TAB_TRIGGER_CLASSNAME}>
              <Image
                src={getImagePath(item.icon)}
                width={32}
                height={32}
                alt={item.alt ?? `Catégorie ${item.label}`}
              />
              {item.label}
            </TabsTrigger>
          )
        )}
      </TabsList>
      {/* Optional TabsContent can be added here */}
    </Tabs>
  );
};

export default AthletesTabs;
