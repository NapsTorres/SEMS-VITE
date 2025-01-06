import { Layout, Button, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { logoutAdmin } from "../zustand/store/store.provider";

const { Header, Content, Footer } = Layout;

export default function CoachSide() {
  const navigate = useNavigate();
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    logoutAdmin()
    navigate("/login"); 
  };

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

      <Footer style={{ textAlign: "center" }}>
        Coach Portal ©{new Date().getFullYear()} | Powered by Ant Design
      </Footer>
    </Layout>
  );
}
