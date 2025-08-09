import { useEffect, useState } from "react";
import "./UserPage.css";
import LineGraph from "../components/LineGraph";
import AccordionTab from "../components/AccordionTab";
import ProfileTab from "../components/ProfileTab";
import WinRateTab from "../components/WinRateTab";
import HeroTab from "../components/HeroTab";
import CompTab from "../components/CompTab";
import AddMatchForm from "../components/AddMatchPopup";

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

function UserPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const [matchData, setMatchData] = useState<MatchEntry[]>([]);
  const [hero, setHero] = useState("");
  const [placement, setPlacement] = useState(8);
  const [mmr, setMMR] = useState(0);
  const [comp, setComp] = useState<string[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [expandedTab, setExpandedTab] = useState<number | null>(null);

  useEffect(() => {
    fetch("http://localhost:4000/user", {
      credentials: "include",
    })
      .then((res) => res.ok && res.json())
      .then((data) => {
        if (data?.loggedIn) {
          setIsLoggedIn(true);
          setUserData({ loggedIn: true, battleTag: data.battleTag });

          const normalized = data.match_entries.map((entry: any) => ({
            hero_name: entry.hero_name,
            placement: entry.placement,
            mmr: entry.post_match_mmr,
            comp: entry.comp_tags ?? [],
            match_date: entry.match_date,
          }));

          setMatchData(normalized);
        }
      });
  }, []);

  if (!isLoggedIn || !userData) {
    return <h2>You are not logged in.</h2>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    fetch("http://localhost:4000/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        hero_name: hero,
        placement,
        post_match_mmr: mmr,
        comp_tags: comp,
      }),
    })
      .then(async (res) => {
        const text = await res.text();
        if (!res.ok) throw new Error("Failed to submit match data");
        return text ? JSON.parse(text) : {};
      })
      .then(() => {
        const newMatch: MatchEntry = {
          hero_name: hero,
          placement,
          mmr,
          comp,
          match_date: new Date().toISOString(),
        };
        setMatchData((prev) => [...prev, newMatch]);
        setHero("");
        setPlacement(8);
        setMMR(0);
        setComp([]);
        setShowForm(false);
      })
      .catch((err) => {
        console.error("Match submission failed:", err);
      });
  };

  const latestMMR =
    matchData.length > 0 ? matchData[matchData.length - 1].mmr : 0;

  const formattedMMRData = matchData.map((match) => {
    const date = new Date(match.match_date);

    const monthYear = date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

    return {
      mmr: match.mmr,
      match_date: match.match_date,
      month_year: monthYear,
    };
  });

  const averagePlacement = matchData.length
    ? matchData.reduce((sum, match) => sum + match.placement, 0) /
      matchData.length
    : 0;

  const placementFrequency = matchData.reduce(
    (acc: Record<number, number>, match) => {
      acc[match.placement] = (acc[match.placement] || 0) + 1;
      return acc;
    },
    {}
  );

  const formattedWinRateData = Array.from({ length: 8 }, (_, i) => {
    const placement = i + 1;
    return {
      placement,
      count: placementFrequency[placement] || 0,
    };
  });

  const userPageSections = [
    {
      id: 1,
      title: "Profile",
      content: (
        <ProfileTab
          userData={userData}
          matchData={matchData}
          latestMMR={latestMMR}
          formattedMMRData={formattedMMRData}
          setShowForm={setShowForm}
        />
      ),
    },
    {
      id: 2,
      title: "Win Rate",
      content: (
        <WinRateTab
          avgPlace={averagePlacement}
          winRateData={formattedWinRateData}
        />
      ),
    },
    { id: 3, title: "Heroes", content: <HeroTab /> },
    { id: 4, title: "Compositions", content: <CompTab /> },
  ];

  return (
    <div id="page-container">
      {showForm && (
        <AddMatchForm
          hero={hero}
          placement={placement}
          mmr={mmr}
          comp={comp}
          setHero={setHero}
          setPlacement={setPlacement}
          setMMR={setMMR}
          setComp={setComp}
          onSubmit={handleSubmit}
          onClose={() => setShowForm(false)}
        />
      )}

      <div id="tabs-container">
        {userPageSections.map((section) => (
          <AccordionTab
            key={section.id}
            title={section.title}
            content={section.content}
            isExpanded={expandedTab === section.id}
            onToggle={() =>
              setExpandedTab(expandedTab === section.id ? null : section.id)
            }
          />
        ))}
      </div>

      <ul>
        {matchData.map((match, index) => (
          <li key={index}>
            Hero: "{match.hero_name}" - Place: "{match.placement}" - MMR: "
            {match.mmr}" - Comp: "{(match.comp || []).join(", ")}" on "
            {new Date(match.match_date).toLocaleDateString()}"
          </li>
        ))}
      </ul>

      <button onClick={() => setShowForm(true)} id="add-button">
        <img src="../src/assets/plus.png" id="plus-button" />
      </button>
    </div>
  );
}

export default UserPage;
