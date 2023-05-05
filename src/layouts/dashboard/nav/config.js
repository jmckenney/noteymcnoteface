// component
import SvgColor from "../../../components/svg-color";

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
);

const navConfig = [
  {
    title: "dashboard",
    path: "/",
  },
  {
    title: "Provider Metrics",
    path: "",
  },
  {
    title: "recently added",
    path: "/dashboard/products",
  },
];

export default navConfig;
