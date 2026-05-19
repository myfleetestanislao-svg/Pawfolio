import { usePathname } from "@/lib/router";
import HomePage from "@/components/home/Home.jsx";
import LoginPage from "@/components/auth/Login.jsx";
import SignupPage from "@/components/auth/Signup.jsx";
import PetsDashboardPage from "@/components/dashboard/PetsDashboard.jsx";
import PetDetailsPage from "@/components/pets/pet-details.jsx";
import PetsPage from "@/components/pets/Pets.jsx";

import RecordsPage from "@/components/records/Records.jsx";
import TimelinePage from "@/components/timeline/Timeline.jsx";
import RemindersPage from "@/components/reminders/Reminders.jsx";
import ShareLinkPage from "@/components/share-link/ShareLink.jsx";

const routes = {
  "/": HomePage,
  "/login": LoginPage,
  "/signup": SignupPage,
  "/dashboard": PetsDashboardPage,
  "/pets": PetsPage,
  "/records": RecordsPage,
  "/timeline": TimelinePage,
  "/reminders": RemindersPage,
  "/share": ShareLinkPage,
  "/share-link": ShareLinkPage,
};


export default function App() {
  const pathname = usePathname();
  const Page = routes[pathname] || (pathname.startsWith("/pets/") ? PetDetailsPage : HomePage);

  return <Page />;
}
