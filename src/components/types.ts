export interface Rule {
  id: string;
  title: string;
  category: string;
  authority: string;
  jurisdiction: {
    level: string;
  };
  why: string;
  actions: string[];
  citationUrl: string;
  trace: {
    all: Array<{
      pass: boolean;
      trace: {
        var: string;
        op: string;
        value: string | number | boolean;
        actual: string | number | boolean;
        pass: boolean;
      };
    }>;
    pass: boolean;
  };
}

export interface Summary {
  byCategory: { [key: string]: number };
  total: number;
}

export interface Version {
  ruleset: string;
  snapshotDate: string;
}

export interface ComplianceResult {
  rules: Rule[];
  summary: Summary;
  version: Version;
}