import { Button, Label, TextInput, Select, Tooltip } from "flowbite-react";
import { useState } from "react";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import Stateoptions from "./stateoptions";
import { FaRegQuestionCircle } from "react-icons/fa";
import { ComplianceResult } from "./types";

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

interface InputFieldProps {
  updateFormData: (data: ComplianceResult) => void;
  updateFormPayload?: (payload: PayloadData) => void;
}

export function InputField({
  updateFormData,
  updateFormPayload,
}: InputFieldProps) {
  const [form, setForm] = useState<PayloadData>({
    state: "",
    mode: "",
    employees: "",
    fte: "",
    naics: "",
    revenue: "",
    consumers: "",
    revenuePctFromDataSales: "",
    isHealthcare: "",
    isBA: "",
    acceptsCard: "",
    isNewBusiness: "",
    sellsData: "",
    city: "",
    isEmployer: "",
  });
  const [loading, setLoading] = useState(false);
  // const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const updatedForm = { ...form, [e.target.id]: e.target.value };
    setForm(updatedForm);
    if (updateFormPayload) {
      updateFormPayload(updatedForm);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Validation
    const stateRegex = /^[A-Z]{2}$/;
    if (!stateRegex.test(form.state)) {
      setLoading(false);
      setError("State must be a selected");
      return;
    }
    const employeesInt = Number(form.employees);
    if (isNaN(employeesInt) || employeesInt < 0) {
      setLoading(false);
      setError("Employees must be an integer ≥ 0");
      return;
    }
    // Default mode to 'operational' if omitted
    const modeValue = form.mode || "operational";
    try {
      const payload = {
        state: form.state,
        city: form.city || undefined,
        naics: form.naics || undefined,
        employees: employeesInt,
        fte: form.fte ? Number(form.fte) : undefined,
        revenue: form.revenue ? Number(form.revenue) : undefined,
        consumers: form.consumers ? Number(form.consumers) : undefined,
        revenuePctFromDataSales: form.revenuePctFromDataSales
          ? Number(form.revenuePctFromDataSales)
          : undefined,
        isHealthcare:
          form.isHealthcare === "true"
            ? true
            : form.isHealthcare === "false"
              ? false
              : undefined,
        isBA:
          form.isBA === "true"
            ? true
            : form.isBA === "false"
              ? false
              : undefined,
        acceptsCard:
          form.acceptsCard === "true"
            ? true
            : form.acceptsCard === "false"
              ? false
              : undefined,
        isNewBusiness:
          form.isNewBusiness === "true"
            ? true
            : form.isNewBusiness === "false"
              ? false
              : undefined,
        sellsData:
          form.sellsData === "true"
            ? true
            : form.sellsData === "false"
              ? false
              : undefined,
        isEmployer:
          form.isEmployer === "true"
            ? true
            : form.isEmployer === "false"
              ? false
              : undefined,
        mode: modeValue,
      };
      const res = await fetch(`${backendUrl}/api/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        const message =
          data?.error === "Invalid request body"
            ? `Invalid request body: ${JSON.stringify(data.details, null, 2)}`
            : data?.error || `Request failed with status ${res.status}`;
        throw new Error(message);
      }
      // setResult(data);
      // Pass form data to parent
      updateFormData(data);
    } catch (err: unknown) {
      console.log(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error");
      }
    } finally {
      setLoading(false);
    }
  };
  const FTETooltipContent = (
    <div>
      <h2> For ACA/ALE purposes:</h2>
      <ul className="list-inside list-disc">
        <li>
          Count your full-time employees (each averaging ≥30 hrs/week or 130
          hrs/month).
        </li>
        <li>
          Add part-time hours for the month (cap 120 hrs per person), then
          divide by 120.
        </li>
        <li>FTE total = full-time count + (part-time hours ÷ 120).</li>
      </ul>
      <h3>
        Example: 35 full-time + twenty part-timers averaging 60 hrs/month each
      </h3>
      <ul className="list-inside list-disc">
        <li>part-time hours = 20×60 = 1200; 1200/120 = 10 FTE</li>
        <li>FTE = 35 + 10 = 45.</li>
      </ul>
    </div>
  );

  const NAISTooltipContent = (
    <div>
      <h2>North American Industry Classification System (NAICS)</h2>
      <p>
        A 6-digit code that classifies your industry (e.g., 722511 =
        Full-Service Restaurants).
      </p>
      <p>
        We use it to attach industry-specific rules or exemptions and to do
        prefix matching (e.g., “72” = Accommodation & Food Services)
      </p>
      <p>It’s the U.S. standard used by federal agencies.</p>
    </div>
  );

  return (
    <form className="flex max-w-md flex-col gap-4" onSubmit={handleSubmit}>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="state">
            What state is business established in?{" "}
            <span className="text-red-500">*</span>
          </Label>
        </div>
        <Select id="state" required value={form.state} onChange={handleChange}>
          <Stateoptions />
        </Select>
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="mode">
            What is current status of the business{" "}
            <span className="text-red-500">*</span>
          </Label>
        </div>
        <Select id="mode" required value={form.mode} onChange={handleChange}>
          <option value="">-- Select mode --</option>
          <option value="operational">Operations</option>
          <option value="formation">Yet to Launch</option>
        </Select>
      </div>
      <div className="flex w-full justify-between gap-2">
        <div className="flex flex-col">
          <div className="mb-2 block">
            <Label htmlFor="employees">
              No of employees <span className="text-red-500">*</span>
            </Label>
          </div>
          <TextInput
            id="employees"
            type="number"
            placeholder="12"
            required
            shadow
            value={form.employees}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col">
          <div className="mb-2 flex items-center gap-2">
            <Label htmlFor="fte">FTE</Label>
            <Tooltip content={FTETooltipContent}>
              <FaRegQuestionCircle />
            </Tooltip>
          </div>
          <TextInput
            id="fte"
            placeholder="2"
            type="number"
            shadow
            value={form.fte}
            onChange={handleChange}
          />
        </div>
      </div>
      <div>
        <div className="mb-2 block">
          <div className="mb-2 flex items-center gap-2">
            <Label htmlFor="naics">Enter your NAICS</Label>
            <Tooltip content={NAISTooltipContent}>
              <FaRegQuestionCircle />
            </Tooltip>
          </div>
        </div>
        <TextInput
          id="naics"
          type="number"
          placeholder="722511"
          value={form.naics}
          onChange={handleChange}
        />
      </div>
      <div className="flex w-full justify-between gap-2">
        <div className="flex flex-col">
          <div className="mb-2 block">
            <Label htmlFor="acceptsCard">Do you accept credit cards?</Label>
          </div>
          <Select
            id="acceptsCard"
            value={form.acceptsCard}
            onChange={handleChange}
          >
            <option value="">-- Select --</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </Select>
        </div>
        <div className="flex flex-col">
          <div className="mb-2 flex items-center gap-2">
            <Label htmlFor="isNewBusiness">Is this a new business?</Label>
          </div>
          <Select
            id="isNewBusiness"
            value={form.isNewBusiness}
            onChange={handleChange}
          >
            <option value="">-- Select --</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </Select>
        </div>
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="revenue">What your revenue per year</Label>
        </div>
        <TextInput
          id="revenue"
          placeholder="0 or 12000"
          type="number"
          value={form.revenue}
          onChange={handleChange}
        />
      </div>
      <div className="flex w-full justify-between gap-2">
        <div className="flex flex-col">
          <div className="mb-2 block">
            <Label htmlFor="consumers">Number of consumers</Label>
          </div>
          <TextInput
            id="consumers"
            placeholder="100"
            type="number"
            value={form.consumers}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col">
          <div className="mb-2 flex items-center gap-2">
            <Label htmlFor="sellsData">Do you sell data?</Label>
          </div>
          <Select id="sellsData" value={form.sellsData} onChange={handleChange}>
            <option value="">-- Select --</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </Select>
        </div>
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="revenuePctFromDataSales">
            What your revenue from data selling per year
          </Label>
        </div>
        <TextInput
          id="revenuePctFromDataSales"
          placeholder="0 or 12000"
          type="number"
          value={form.revenuePctFromDataSales}
          onChange={handleChange}
        />
      </div>
      <div className="flex w-full justify-between gap-2">
        <div className="flex flex-col">
          <div className="mb-2 block">
            <Label htmlFor="isHealthcare">Are we a HIPAA covered entity?</Label>
          </div>
          <Select
            id="isHealthcare"
            value={form.isHealthcare}
            onChange={handleChange}
          >
            <option value="">-- Select --</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </Select>
        </div>
        <div className="flex flex-col">
          <div className="mb-2 flex items-center gap-2">
            <Label htmlFor="isBA">Are we a HIPAA business associate?</Label>
          </div>
          <Select id="isBA" value={form.isBA} onChange={handleChange}>
            <option value="">-- Select --</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </Select>
        </div>
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="city">City (optional)</Label>
        </div>
        <TextInput
          id="city"
          placeholder="City"
          type="text"
          value={form.city}
          onChange={handleChange}
        />
      </div>
      <div className="flex w-full justify-between gap-2">
        <div className="flex flex-col">
          <div className="mb-2 block">
            <Label htmlFor="isEmployer">Are you an employer? (optional)</Label>
          </div>
          <Select
            id="isEmployer"
            value={form.isEmployer}
            onChange={handleChange}
          >
            <option value="">-- Select --</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </Select>
        </div>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Checking..." : "Know the Compliance Status"}
      </Button>
      {error && <div className="mt-2 text-red-500">{error}</div>}
    </form>
  );
}
export default InputField;
