interface TextDefinition {
  mobile: {
    size: number;
    rows: number;
  };
  desktop: {
    size: number;
    rows: number;
  };
}

export interface Theme {
  rowHeight: number;
  columnWidth: number;
  contentWidth: number;
  headingFont: string;
  headingDescenderHeightScale: number;
  bodyFont: string;
  codeFont: string;
  bodyDescenderHeightScale: number;
  heading: Record<'h1' | 'h2' | 'h3', TextDefinition>;
  text: Record<'standard' | 'small' | 'xsmall' | 'code', TextDefinition>;
  weight: {
    strong: number;
    regular: number;
  };
  color: {
    strong: string;
    neutral: string;
    code: string;
  };
  background: {
    body: string;
    menu: string;
    overlay: string;
    code: string;
    note: string;
  };
  border: {
    standard: number;
  };
}
