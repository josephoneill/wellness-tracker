import WellnessRatingChart from "@/components/wellness-rating/WellnessRatingChart";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mantine/core";
import { useState } from "react";

const DashboardPage = () => {
  const [showAll, setShowAll] = useState<boolean>(true);
  const { logout } = useAuth0();

  return (
    <div>
      <WellnessRatingChart
        showAll={showAll}
        setShowAll={setShowAll}
        showSettings={true}
        title="Wellness Ratings Chart"
      />
      <Button onClick={() => logout()} />
    </div>
  );
}

export default DashboardPage;
