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
  bodyDescenderHeightScale: number;
  heading: Record<'h1' | 'h2' | 'h3', TextDefinition>;
  text: Record<'standard' | 'small', TextDefinition>;
  weight: {
    strong: number;
    regular: number;
  };
  color: {
    neutral: string;
    code: string;
  };
  background: {
    body: string;
    menu: string;
    code: string;
    note: string;
  };
  border: {
    standard: number;
  };
}
