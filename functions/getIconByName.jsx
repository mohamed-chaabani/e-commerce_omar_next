import * as LucideIcons from "lucide-react";

export function getIconByName(iconName, props = {}) {
  const IconComponent = LucideIcons[iconName];
  if (!IconComponent) return <LucideIcons.HelpCircle {...props} />;
  return <IconComponent {...props} />;
}
