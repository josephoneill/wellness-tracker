export type Typology = {
  sk: TypologyID,
  typologyType: string,
  entityType: string,
  created: string,
};

export type TypologyID = `Typology#${string}`;
