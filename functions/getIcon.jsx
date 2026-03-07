import {
  Award,
  BarChart,
  BarChart3,
  Code,
  Globe,
  MessageSquare,
  Rocket,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";

const getIcon = (iconName) => {
  switch (iconName) {
    case "code":
      return <Code className="w-8 h-8 text-blue-500" />;
    case "chart":
      return <BarChart3 className="w-8 h-8 text-blue-500" />;
    case "award":
      return <Award className="w-8 h-8 text-blue-500" />;
    case "Rocket":
      return <Rocket className="w-6 h-6" />;
    case "message":
      return <MessageSquare className="w-8 h-8 text-blue-500" />;
    case "TrendingUp":
      return <TrendingUp className="w-6 h-6" />;
    case "Shield":
      return <Shield className="w-6 h-6" />;
    case "users":
      return <Users className="w-8 h-8 text-blue-500" />;
    case "globe":
      return <Globe className="w-8 h-8 text-blue-500" />;
    case "Diagramme à barres":
      return <BarChart className="w-8 h-8 text-blue-500" />;
    default:
      return <Code className="w-8 h-8 text-blue-500" />;
  }
};

export default getIcon;
