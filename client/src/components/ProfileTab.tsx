import "./ProfileTab.css";
import LineGraph from "./LineGraph";

interface UserData {
  loggedIn: boolean;
  battleTag: string;
}

interface MatchEntry {
  hero_name: string;
  placement: number;
  mmr: number;
  comp: string[];
  match_date: string;
}

interface ProfileTabProps {
  userData: UserData;
  matchData: MatchEntry[];
  latestMMR: number;
  formattedMMRData: { month_year: string; mmr: number }[];
  setShowForm: (show: boolean) => void;
}

function ProfileTab({
  userData,
  matchData,
  latestMMR,
  formattedMMRData,
  setShowForm,
}: ProfileTabProps) {
  return (
    <div className="info-section-container">
      <div className="left-section-container">
        <img src="../src/assets/default.png" id="pfp-image" />
        <h1>Hi, {userData.battleTag.split("#")[0]}</h1>
        <h2>Current MMR: {latestMMR}</h2>
        <button id="add-match-button" onClick={() => setShowForm(true)}>
          Add Match
        </button>
      </div>
      <div className="right-section-container">
        {matchData.length > 0 && (
          <>
            <h3>MMR Progression</h3>
            <LineGraph
              width={600}
              height={300}
              data={formattedMMRData}
              xKey="month_year"
              yKey="mmr"
              yLabel="MMR"
            />
          </>
        )}
      </div>
    </div>
  );
}

export default ProfileTab;
