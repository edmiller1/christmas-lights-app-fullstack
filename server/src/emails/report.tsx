import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Row,
  Column,
  Text,
  Heading,
  Button,
  Hr,
  Img,
} from "@react-email/components";

interface Props {
  userName: string;
  decorationName: string;
}

export const ReportEmail = ({ userName, decorationName }: Props) => {
  return (
    <Html>
      <Head />
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section
            style={{
              padding: "20px",
              textAlign: "center" as const,
            }}
          >
            <Img
              src="https://example.com/christmas-lights-app-logo.png"
              alt="Christmas Lights App Logo"
              width="150"
              height="50"
              style={logoStyle}
            />
          </Section>

          <Section style={mainContentStyle}>
            <Heading style={headingStyle}>Report Received</Heading>

            <Text style={paragraphStyle}>Hello {userName},</Text>

            <Text style={paragraphStyle}>
              Thank you for submitting your report regarding "{decorationName}".
              We have received your submission and our team is reviewing it.
            </Text>

            <Text style={paragraphStyle}>
              We appreciate your feedback and will be in touch with you shortly
              regarding your report.
            </Text>

            <Text style={paragraphStyle}>
              If you have any additional information to provide, please reply to
              this email.
            </Text>
          </Section>

          <Hr style={dividerStyle} />

          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              © 2025 Christmas Lights App. All rights reserved.
            </Text>
            <Text style={footerTextStyle}>
              123 Holiday Lane, North Pole, Arctic Circle
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const bodyStyle = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  margin: "0",
  padding: "0",
};

const containerStyle = {
  margin: "0 auto",
  padding: "20px 0",
  width: "100%",
  maxWidth: "600px",
};

const headerStyle = {
  padding: "20px",
  textAlign: "center",
};

const logoStyle = {
  margin: "0 auto",
};

const mainContentStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  padding: "40px 20px",
  border: "2px solid #de3d33",
};

const headingStyle = {
  color: "#de3d33", // Christmas red
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0 0 30px",
  textAlign: "center" as const,
};

const paragraphStyle = {
  color: "#333333",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 20px",
};

const dividerStyle = {
  borderTop: "1px solid #e6ebf1",
  margin: "20px 0",
};

const footerStyle = {
  padding: "20px 0",
  textAlign: "center" as const,
};

const footerTextStyle = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  margin: "0 0 10px",
};
