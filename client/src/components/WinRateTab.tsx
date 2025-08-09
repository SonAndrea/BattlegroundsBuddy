import BarGraph from "../components/BarGraph";

interface WinRateProps {
  avgPlace: number;
  winRateData: any[];
}

function WinRateTab({ avgPlace, winRateData }: WinRateProps) {
  return (
    <>
      <div className="info-section-container">
        <div className="left-section-container">
          <h1>{avgPlace}</h1>
          <h5>Average Placement</h5>
        </div>
        <div className="right-section-container">
          <BarGraph
            width={600}
            height={300}
            data={winRateData}
            xKey="placement"
            yKey="count"
            yLabel="NUMBER OF MATCHES"
          />
        </div>
      </div>
    </>
  );
}

export default WinRateTab;
