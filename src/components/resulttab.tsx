import { ComplianceResult } from "./types";
import { FaExclamationCircle } from "react-icons/fa";
import {
  Card,
  Badge,
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle,
} from "flowbite-react";

const ResultTab = ({ resultData }: { resultData: ComplianceResult | null }) => {
  return (
    <div className="flex flex-col gap-2">
      <Card>
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Compliance Summary
        </h5>

        {resultData?.summary.total != 0 ? (
          <div>Total Compliances: {resultData?.summary.total}</div>
        ) : (
          <p>
            Nothing to worry about since you have no employees. Please check the
            details you entered if you feel this is wrong
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          {resultData?.summary.byCategory &&
            Object.entries(resultData.summary.byCategory).map(
              ([category, count]) => (
                <Badge key={category} color="yellow" icon={FaExclamationCircle}>
                  {category} - {count}
                </Badge>
              ),
            )}
        </div>
      </Card>
      <Card className="overflow-y-auto">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Compliance Details
        </h5>
        {resultData?.summary.total !== 0 ? (
          <Accordion collapseAll>
            {(resultData?.rules ?? []).map((rule) => (
              <AccordionPanel key={rule.id}>
                <AccordionTitle>
                  {rule.id.toUpperCase()} - {rule.title}
                </AccordionTitle>
                <AccordionContent>
                  <p className="mb-2 text-gray-500 dark:text-gray-400">
                    <span className="font-bold">Rule Id</span> - {rule.id}
                  </p>
                  <p className="mb-2 text-gray-500 dark:text-gray-400">
                    <span className="font-bold">Title</span> - {rule.title}
                  </p>
                  <p className="mb-2 text-gray-500 dark:text-gray-400">
                    <span className="font-bold">Category</span> -{" "}
                    {rule.category}
                  </p>
                  <p className="mb-2 text-gray-500 dark:text-gray-400">
                    <span className="font-bold">Jurisdiction</span> -{" "}
                    {rule.jurisdiction.level}
                  </p>
                  <p className="mb-2 text-gray-500 dark:text-gray-400">
                    <span className="font-bold">Why needed</span> - {rule.why}
                  </p>
                  <p className="mb-2 text-gray-500 dark:text-gray-400">
                    <span className="font-bold">Actions</span> -{" "}
                    {rule.actions.join(", ")}
                  </p>
                  <p className="mb-2 text-gray-500 dark:text-gray-400">
                    <span className="font-bold">Citation</span> -{" "}
                    <a
                      className="text-blue-500 hover:underline"
                      target="_blank"
                      href={rule.citationUrl}
                    >
                      {rule.citationUrl}
                    </a>
                  </p>
                </AccordionContent>
              </AccordionPanel>
            ))}
          </Accordion>
        ) : (
          <p>No compliance details available.</p>
        )}
      </Card>
    </div>
  );
};

export default ResultTab;
