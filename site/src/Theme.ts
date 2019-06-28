interface TextDefinition {
  size: number;
  rows: number;
}

export interface Theme {
  rowHeight: number;
  columnWidth: number;
  contentWidth: number;
  headingFont: string;
  bodyFont: string;
  descenderHeightScale: number;
  heading: Record<'h1' | 'h2' | 'h3', TextDefinition>;
  text: Record<'standard', TextDefinition>;
  weight: {
    strong: number;
    regular: number;
  };
  color: {
    neutral: string;
    code: string;
  };
}
