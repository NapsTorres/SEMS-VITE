import { Layout, Button, theme } from "antd";
// import { MdDashboard } from "react-icons/md";
// import { RiTeamFill } from "react-icons/ri";
// import { TbScoreboard } from "react-icons/tb";
// import { RouterUrl } from "../routes";
import { Outlet, useNavigate } from "react-router-dom";
import { logoutAdmin } from "../zustand/store/store.provider";

const { Header, Content, Footer } = Layout;

// const menuItems = [
//   {
//     key: "dashboard",
//     icon: <MdDashboard size={20} />,
//     label: "Dashboard",
//     path: RouterUrl.Coach,
//   },
//   {
//     key: "teams",
//     icon: <RiTeamFill size={20} />,
//     label: "Teams",
//     path: RouterUrl.CoachTeam,
//   },
//   {
//     key: "standing",
//     icon: <TbScoreboard size={20} />,
//     label: "Standings",
//     path: RouterUrl.CoachStanding,
//   },
// ];

export default function CoachSide() {
  const navigate = useNavigate();
//   const location = useLocation();
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

//   const currentMenuKey =
//     menuItems.find((item) => location.pathname.includes(item.path))?.key ||
//     "dashboard";

//   const handleMenuClick = (e: { key: string }) => {
//     const selectedItem = menuItems.find((item) => item.key === e.key);
//     if (selectedItem) navigate(selectedItem.path);
//   };

  const handleLogout = () => {
    logoutAdmin()
    navigate("/login"); 
  };

//   const breadcrumbItems = location.pathname
//     .split("/")
//     .filter((path) => path)
//     .map((path, index) => (
//       <Breadcrumb.Item key={index}>{path}</Breadcrumb.Item>
//     ));

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          backgroundColor: "#064518",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 20px",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="logo" style={{ color: "#fff", fontSize: "1.5rem" }}>
          Coach Portal
        </div>

        <Button
          type="primary"
          danger
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Header>

      <Content style={{ padding: "24px" }}>
        {/* <Breadcrumb style={{ marginBottom: "16px" }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          {breadcrumbItems}
        </Breadcrumb> */}
        <div
          style={{
            background: "#e9ece4",
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Outlet />
        </div>
      </Content>

      {/* Footer */}
      <Footer style={{ textAlign: "center" }}>
        Coach Portal ©{new Date().getFullYear()} | Powered by Ant Design
      </Footer>
    </Layout>
  );
}
