import { ComplianceResult } from "./types";
import ResultTab from "./resulttab";

const ResultSection = ({
  resultData,
}: {
  resultData: ComplianceResult | null;
}) => {
  return (
    <>
      {resultData ? (
        <div className="flex-1 overflow-y-auto">
          <ResultTab resultData={resultData} />
        </div>
      ) : (
        <div className="flex-1 text-center overflow-y-auto">
          <p>
            Enter your business details to know more about compliance
            requirements.
          </p>
        </div>
      )}
    </>
  );
};

export default ResultSection;
