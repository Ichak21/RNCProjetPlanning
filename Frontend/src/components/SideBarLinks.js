import React from "react";
import * as AiIcons from "react-icons/ai";
import * as FaIcons from "react-icons/fa";
import * as IoIcons from "react-icons/io";
import * as MdIcons from "react-icons/md";
import * as BsIcons from "react-icons/bs";

export const SideBarLinks = [
  {
    title: "Accueil",
    path: "/home",
    icon: <AiIcons.AiFillHome />,
    cName: "sidebar-link-text",
  },
  {
    title: "Opérateur",
    path: "/operateur",
    icon: <IoIcons.IoMdPeople />,
    cName: "sidebar-link-text",
  },
  {
    title: "Compétences",
    path: "/competences",
    icon: <IoIcons.IoIosSchool />,
    cName: "sidebar-link-text",
  },
  {
    title: "Secteur",
    path: "/secteur",
    icon: <FaIcons.FaIndustry />,
    cName: "sidebar-link-text",
  },
  {
    title: "Station",
    path: "/station",
    icon: <FaIcons.FaDesktop />,
    cName: "sidebar-link-text",
  },
  {
    title: "Saisie",
    path: "/saisie",
    icon: <BsIcons.BsCalendarWeekFill />,
    cName: "sidebar-link-text",
  },
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <FaIcons.FaChartPie />,
    cName: "sidebar-link-text",
  },
  {
    title: "Support",
    path: "/support",
    icon: <MdIcons.MdContactSupport />,
    cName: "sidebar-link-text",
  },
];
