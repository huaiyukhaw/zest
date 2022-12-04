export type RouteType = {
  id: string;
  name: string;
  path: string;
};

export const defaultRoutes: Array<RouteType> = [
  {
    id: "ProjectSection",
    name: "Projects",
    path: "projects",
  },
  {
    id: "SideProjectSection",
    name: "Side Projects",
    path: "side-projects",
  },
  {
    id: "ExhibitionSection",
    name: "Exhibitions",
    path: "exhibitions",
  },
  {
    id: "SpeakingSection",
    name: "Speaking",
    path: "speaking",
  },
  {
    id: "WritingSection",
    name: "Writing",
    path: "writing",
  },
  {
    id: "AwardSection",
    name: "Awards",
    path: "awards",
  },
  {
    id: "FeatureSection",
    name: "Features",
    path: "features",
  },
  {
    id: "WorkExperienceSection",
    name: "Work Experience",
    path: "work-experience",
  },
  {
    id: "VolunteeringSection",
    name: "Volunteering",
    path: "volunteering",
  },
  {
    id: "EducationSection",
    name: "Education",
    path: "education",
  },
  {
    id: "CertificationSection",
    name: "Certifications",
    path: "certifications",
  },
  {
    id: "SocialLinkSection",
    name: "Social Links",
    path: "links",
  },
];
