import InputField from "./inputField";
import ResultSection from "./resultsection";
import { useState } from "react";
import { ComplianceResult } from "./types";
import { Card, TabItem, Tabs } from "flowbite-react";
import { IoDocuments } from "react-icons/io5";
import { RiChatAiFill } from "react-icons/ri";
import ChatTab from "./chattab";

interface PayloadData {
  state: string;
  mode?: string;
  employees: string;
  fte?: string;
  naics?: string;
  revenue?: string;
  consumers?: string;
  revenuePctFromDataSales?: string;
  isHealthcare?: string;
  isBA?: string;
  acceptsCard?: string;
  isNewBusiness?: string;
  sellsData?: string;
  city?: string;
  isEmployer?: string;
}
const HeroSection = () => {
  const [formPayload, setFormPayload] = useState<PayloadData | null>(null);
  const [resultData, setResultData] = useState<ComplianceResult | null>(null);
  const [chatEnabled, setChatEnabled] = useState<boolean>(false);

  // This function will be called from InputField on every form change
  const updateFormPayload = (payload: PayloadData) => {
    setFormPayload(payload);
  };

  // This function will be called from InputField on submit
  const updateFormData = (data: ComplianceResult) => {
    setResultData(data);
    setChatEnabled(true);
  };

  return (
    <div className="flex h-full w-full flex-col gap-2 text-gray-900 lg:flex-row dark:text-white">
      <Card className="flex flex-col lg:w-1/3">
        <div className="flex-1 overflow-y-auto">
          <InputField
            updateFormData={updateFormData}
            updateFormPayload={updateFormPayload}
          />
        </div>
      </Card>
      <Card className="flex flex-col lg:w-2/3">
        <div className="flex-1 overflow-y-auto">
          <Tabs aria-label="Default tabs" variant="default" className="z-10">
            <TabItem
              active
              title="Business Compliance Results"
              icon={IoDocuments}
            >
              <ResultSection resultData={resultData} />
            </TabItem>
            <TabItem
              disabled={!chatEnabled}
              title={chatEnabled ? "Chat with AI to know more" : "Fill and submit the form to enable chat"}
              icon={RiChatAiFill}
            >
              <ChatTab resultData={resultData} payload={formPayload} />
            </TabItem>
          </Tabs>
        </div>
      </Card>
    </div>
  );
};

export default HeroSection;
