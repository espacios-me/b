export type EntityType =
  | "person"
  | "company"
  | "broker"
  | "developer"
  | "project"
  | "property"
  | "community"
  | "campaign"
  | "engagement"
  | "source"
  | "document"
  | "household"
  | "opportunity";

export type RelationshipType =
  | "works_for"
  | "broker_for"
  | "interested_in"
  | "owns"
  | "lives_in"
  | "same_community_as"
  | "same_broker_as"
  | "referred_by"
  | "connected_to"
  | "contacted_by"
  | "part_of"
  | "manages"
  | "represents"
  | "invested_in"
  | "tied_to_campaign"
  | "linked_to_document"
  | "belongs_to_household"
  | "same_company_domain";

export interface DatosEntity {
  id: string;
  type: EntityType;
  title: string;
  subtitle?: string;
  confidence: number;
  sourceCount: number;
  tags: string[];
  timeline?: string;
  facts: Record<string, string | number | string[]>;
}

export interface DatosRelationship {
  id: string;
  fromId: string;
  toId: string;
  type: RelationshipType;
  confidence: number;
  source: string;
  inferred?: boolean;
  notes?: string;
}

const baseEntities: DatosEntity[] = [
  {
    id: "person_1",
    type: "person",
    title: "Aisha Rahman",
    subtitle: "Investor buyer",
    confidence: 0.93,
    sourceCount: 6,
    tags: ["investor", "hot-lead", "3-bedroom"],
    timeline: "Need shortlist in 21 days",
    facts: {
      bedrooms: 3,
      budget: "AED 2.3M - 2.8M",
      preferred_communities: ["Dubai Hills", "Creek Harbour"],
      company_email: "aisha@northstarcapital.ae",
      financing_type: "Mortgage",
      role_in_deal: "Primary decision maker",
      source_confidence: "High",
    },
  },
  {
    id: "person_2",
    type: "person",
    title: "Omar Rahman",
    subtitle: "End-user",
    confidence: 0.88,
    sourceCount: 4,
    tags: ["end-user", "family-buyer"],
    timeline: "Move-in within 4 months",
    facts: {
      bedrooms: 3,
      preferred_communities: ["Dubai Hills"],
      company_email: "omar@examplemail.com",
      financing_type: "Cash",
      investor_vs_end_user: "End-user",
      role_in_deal: "Co-buyer",
    },
  },
  {
    id: "broker_1",
    type: "broker",
    title: "Maya Kline",
    subtitle: "Prime Bridge Realty",
    confidence: 0.9,
    sourceCount: 5,
    tags: ["broker-linked"],
    facts: {
      broker_overlap: "person_1, person_2, person_3",
      brn: "BRN-21911",
      market_focus: "Family apartments",
    },
  },
  {
    id: "company_1",
    type: "company",
    title: "Northstar Capital",
    subtitle: "northstarcapital.ae",
    confidence: 0.95,
    sourceCount: 3,
    tags: ["company-cluster"],
    facts: {
      domain: "northstarcapital.ae",
      same_domain_links: "person_1, person_3",
      industry: "Private investment",
    },
  },
  {
    id: "developer_1",
    type: "developer",
    title: "Emaar Properties",
    subtitle: "Tier A developer",
    confidence: 0.99,
    sourceCount: 8,
    tags: ["trusted-developer"],
    facts: {
      typical_price_min: "AED 1.5M",
      typical_price_max: "AED 10M",
    },
  },
  {
    id: "community_1",
    type: "community",
    title: "Dubai Hills",
    subtitle: "Family oriented",
    confidence: 0.97,
    sourceCount: 7,
    tags: ["same-community"],
    facts: {
      city: "Dubai",
      market_tier: "Premium",
      family_friendly_score: 9,
    },
  },
  {
    id: "project_1",
    type: "project",
    title: "Park Horizon",
    subtitle: "Dubai Hills",
    confidence: 0.86,
    sourceCount: 4,
    tags: ["project-match"],
    facts: {
      handover_date: "2027-03-01",
      payment_plan: "70/30",
      location_tier: "A",
    },
  },
  {
    id: "property_1",
    type: "property",
    title: "PH-1208",
    subtitle: "3BR Apartment",
    confidence: 0.9,
    sourceCount: 3,
    tags: ["3-bedroom", "available"],
    facts: {
      bedrooms: 3,
      bathrooms: 4,
      price: "AED 2.45M",
      financing_type: "Mortgage eligible",
      same_building_link: "property_2",
    },
  },
  {
    id: "campaign_1",
    type: "campaign",
    title: "Q2 Family Upgrade",
    subtitle: "Meta lead ads",
    confidence: 0.85,
    sourceCount: 2,
    tags: ["campaign"],
    facts: {
      budget: "AED 120,000",
      objective: "Qualified meetings",
    },
  },
  {
    id: "engagement_1",
    type: "engagement",
    title: "WhatsApp Intro",
    subtitle: "Aisha Rahman",
    confidence: 0.82,
    sourceCount: 1,
    tags: ["contacted"],
    facts: {
      who_introduced_whom: "Maya introduced Aisha to Sara (agent)",
      channel: "WhatsApp",
      timeline: "2026-03-28",
    },
  },
  {
    id: "document_1",
    type: "document",
    title: "Buyer Requirement Sheet",
    subtitle: "Google Drive",
    confidence: 0.9,
    sourceCount: 1,
    tags: ["source-doc"],
    facts: {
      source_confidence: "High",
      extracted: "Budget + bedroom + community preference",
    },
  },
  {
    id: "source_1",
    type: "source",
    title: "Drive Import Batch 17",
    subtitle: "CSV + Sheet",
    confidence: 0.78,
    sourceCount: 1,
    tags: ["import"],
    facts: {
      rows: 319,
      quality: "92% mapped",
    },
  },
  {
    id: "household_1",
    type: "household",
    title: "Rahman Household",
    subtitle: "Family cluster",
    confidence: 0.91,
    sourceCount: 4,
    tags: ["household"],
    facts: {
      members: ["Aisha Rahman", "Omar Rahman"],
      current_community: "Downtown",
    },
  },
  {
    id: "opportunity_1",
    type: "opportunity",
    title: "Rahman - Park Horizon 3BR",
    subtitle: "Negotiation",
    confidence: 0.89,
    sourceCount: 5,
    tags: ["deal", "mortgage"],
    timeline: "Expected close 2026-04-28",
    facts: {
      deal_stage: "Negotiation",
      estimated_value: "AED 2.45M",
      role_in_deal: "Investor lead",
      financing_type: "Mortgage",
    },
  },
];

const baseRelationships: DatosRelationship[] = [
  { id: "r1", fromId: "person_1", toId: "broker_1", type: "broker_for", confidence: 0.96, source: "CRM notes" },
  { id: "r2", fromId: "person_2", toId: "broker_1", type: "broker_for", confidence: 0.93, source: "Call log" },
  { id: "r3", fromId: "person_1", toId: "company_1", type: "works_for", confidence: 0.9, source: "Email domain" },
  { id: "r4", fromId: "person_1", toId: "community_1", type: "interested_in", confidence: 0.94, source: "Requirement sheet" },
  { id: "r5", fromId: "person_2", toId: "community_1", type: "interested_in", confidence: 0.83, source: "WhatsApp" },
  { id: "r6", fromId: "project_1", toId: "developer_1", type: "part_of", confidence: 0.99, source: "Project brochure" },
  { id: "r7", fromId: "project_1", toId: "community_1", type: "part_of", confidence: 0.99, source: "Project brochure" },
  { id: "r8", fromId: "property_1", toId: "project_1", type: "part_of", confidence: 0.95, source: "Listing sheet" },
  { id: "r9", fromId: "person_1", toId: "opportunity_1", type: "interested_in", confidence: 0.92, source: "Opportunity card" },
  { id: "r10", fromId: "campaign_1", toId: "engagement_1", type: "tied_to_campaign", confidence: 0.87, source: "Campaign manager" },
  { id: "r11", fromId: "engagement_1", toId: "person_1", type: "contacted_by", confidence: 0.9, source: "WhatsApp" },
  { id: "r12", fromId: "document_1", toId: "person_1", type: "linked_to_document", confidence: 0.91, source: "Drive KB" },
  { id: "r13", fromId: "person_1", toId: "household_1", type: "belongs_to_household", confidence: 0.88, source: "Manual review" },
  { id: "r14", fromId: "person_2", toId: "household_1", type: "belongs_to_household", confidence: 0.88, source: "Manual review" },
  { id: "r15", fromId: "broker_1", toId: "person_1", type: "referred_by", confidence: 0.78, source: "Engagement notes", notes: "Broker introduced to internal agent" },
];

function relationExists(rels: DatosRelationship[], fromId: string, toId: string, type: RelationshipType) {
  return rels.some((r) => r.fromId === fromId && r.toId === toId && r.type === type);
}

function inferRelationships(entities: DatosEntity[], relationships: DatosRelationship[]) {
  const inferred: DatosRelationship[] = [];
  const people = entities.filter((entity) => entity.type === "person");

  people.forEach((person, index) => {
    for (let cursor = index + 1; cursor < people.length; cursor += 1) {
      const compared = people[cursor];
      const personCommunities = new Set((person.facts.preferred_communities as string[] | undefined) ?? []);
      const comparedCommunities = new Set((compared.facts.preferred_communities as string[] | undefined) ?? []);
      const sharesCommunity = Array.from(personCommunities).some((community) => comparedCommunities.has(community));

      if (sharesCommunity) {
        inferred.push({
          id: `inf_comm_${person.id}_${compared.id}`,
          fromId: person.id,
          toId: compared.id,
          type: "same_community_as",
          confidence: 0.79,
          source: "Inferred from preferred_communities",
          inferred: true,
        });
      }

      if ((person.facts.broker_overlap as string | undefined)?.includes(compared.id)) {
        inferred.push({
          id: `inf_broker_${person.id}_${compared.id}`,
          fromId: person.id,
          toId: compared.id,
          type: "same_broker_as",
          confidence: 0.84,
          source: "Inferred from broker overlap",
          inferred: true,
        });
      }
    }
  });

  const companies = entities.filter((entity) => entity.type === "company");
  const persons = entities.filter((entity) => entity.type === "person");

  persons.forEach((person) => {
    const emailDomain = String(person.facts.company_email ?? "").split("@")[1];
    if (!emailDomain) return;

    companies.forEach((company) => {
      if (company.facts.domain === emailDomain && !relationExists(relationships, person.id, company.id, "same_company_domain")) {
        inferred.push({
          id: `inf_domain_${person.id}_${company.id}`,
          fromId: person.id,
          toId: company.id,
          type: "same_company_domain",
          confidence: 0.81,
          source: "Inferred from email domain",
          inferred: true,
        });
      }
    });
  });

  return inferred;
}

export const datosEntities = baseEntities;
export const datosRelationships = [...baseRelationships, ...inferRelationships(baseEntities, baseRelationships)];

export function getEntityById(id: string) {
  return datosEntities.find((entity) => entity.id === id);
}

export function getRelatedRelationships(entityId: string) {
  return datosRelationships.filter((relationship) => relationship.fromId === entityId || relationship.toId === entityId);
}
