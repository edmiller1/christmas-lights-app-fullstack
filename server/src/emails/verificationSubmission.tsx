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
  decorationImage: string;
  submissionDate: string;
  submissionId: string;
}

export const VerificationSubmissionEmail = ({
  userName,
  decorationName,
  decorationImage,
  submissionDate,
  submissionId,
}: Props) => {
  return (
    <Html>
      <Head />
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerStyle}>
            <Img
              src="https://example.com/christmas-lights-app-logo.png"
              alt="Christmas Lights App Logo"
              width="150"
              height="50"
              style={logoStyle}
            />
          </Section>

          <Section style={mainContentStyle}>
            <Heading style={headingStyle}>
              Verification Request Received
            </Heading>

            <Text style={paragraphStyle}>Hello {userName},</Text>

            <Text style={paragraphStyle}>
              Thank you for submitting your decoration "{decorationName}" for
              verification. We've received your submission and our team will
              review it shortly.
            </Text>

            <Section style={decorationCardStyle}>
              <Img
                src={decorationImage}
                alt={decorationName}
                width="100%"
                height="auto"
                style={decorationImageStyle}
              />
              <Text style={decorationNameStyle}>{decorationName}</Text>

              <Section style={detailsContainerStyle}>
                <Row>
                  <Column>
                    <Text style={detailLabelStyle}>Submission ID:</Text>
                  </Column>
                  <Column>
                    <Text style={detailValueStyle}>{submissionId}</Text>
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <Text style={detailLabelStyle}>Date Submitted:</Text>
                  </Column>
                  <Column>
                    <Text style={detailValueStyle}>{submissionDate}</Text>
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <Text style={detailLabelStyle}>Expected Response:</Text>
                  </Column>
                  <Column>
                    <Text style={detailValueStyle}>Within 48 hours</Text>
                  </Column>
                </Row>
              </Section>
            </Section>

            <Section style={infoBoxStyle}>
              <Text style={infoTitleStyle}>What happens next?</Text>
              <Text style={infoTextStyle}>
                Our verification team will review your submission to ensure it
                meets our community guidelines. Once verified, your decoration
                will receive a "Verified" badge, making it more prominent in
                search results and eligible for special contests.
              </Text>
            </Section>

            <Section style={ctaContainerStyle}>
              <Button
                href="https://christmaslightsapp.com/my-submissions"
                style={buttonStyle}
              >
                Track Your Submission
              </Button>
            </Section>

            <Text style={paragraphStyle}>
              If you have any questions about the verification process, please
              don't hesitate to contact our support team.
            </Text>
          </Section>

          <Hr style={dividerStyle} />

          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              © 2025 Christmas Lights App. All rights reserved.
            </Text>
            <Text style={footerTextStyle}>
              This email was sent regarding your decoration verification
              request. You will receive a follow-up email once your submission
              has been reviewed.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const bodyStyle = {
  backgroundColor: "#f1f7e9", // Light green background
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
  textAlign: "center" as const,
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

const decorationCardStyle = {
  backgroundColor: "#f9f9f9",
  borderRadius: "8px",
  overflow: "hidden",
  marginBottom: "30px",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
};

const decorationImageStyle = {
  display: "block",
  width: "100%",
  maxHeight: "300px",
  objectFit: "cover" as const,
};

const decorationNameStyle = {
  fontSize: "18px",
  fontWeight: "bold",
  padding: "15px 15px 0",
  margin: "0",
};

const detailsContainerStyle = {
  padding: "10px 15px 15px",
};

const detailLabelStyle = {
  fontSize: "14px",
  color: "#666666",
  fontWeight: "bold",
  padding: "5px 0",
};

const detailValueStyle = {
  fontSize: "14px",
  color: "#333333",
  padding: "5px 0",
};

const infoBoxStyle = {
  backgroundColor: "#f8f4e8", // Light warm color
  borderRadius: "8px",
  padding: "15px",
  marginBottom: "25px",
  borderLeft: "4px solid #007f4f", // Darker green
};

const infoTitleStyle = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#007f4f", // Darker green
  margin: "0 0 10px",
};

const infoTextStyle = {
  fontSize: "14px",
  lineHeight: "20px",
  color: "#555555",
  margin: "0",
};

const ctaContainerStyle = {
  textAlign: "center" as const,
  margin: "30px 0",
};

const buttonStyle = {
  backgroundColor: "#de3d33",
  color: "#ffffff",
  border: "none",
  borderRadius: "4px",
  fontSize: "16px",
  fontWeight: "bold",
  padding: "12px 20px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
};

const dividerStyle = {
  borderTop: "1px solid #de3d33",
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

export default VerificationSubmissionEmail;
