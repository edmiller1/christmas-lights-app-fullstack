import {
  Html,
  Head,
  Body,
  Container,
  Section,
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
  rating: number;
}

export const NewRatingEmail = ({
  userName,
  decorationName,
  decorationImage,
  rating,
}: Props) => {
  // Generate star rating display
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push("★");
    }

    if (hasHalfStar) {
      stars.push("½");
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push("☆");
    }

    return stars.join(" ");
  };

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
            <Heading style={headingStyle}>New Rating Received!</Heading>

            <Text style={paragraphStyle}>Hello {userName},</Text>

            <Text style={paragraphStyle}>
              Great news! Your decoration "{decorationName}" has received a new
              rating.
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

              <Section style={ratingContainerStyle}>
                <Text style={ratingLabelStyle}>Rating:</Text>
                <Text style={ratingValueStyle}>{rating} / 5</Text>
                <Text style={starRatingStyle}>{renderStars()}</Text>
              </Section>
            </Section>

            <Section style={ctaContainerStyle}>
              <Button
                href="https://christmaslightsapp.com/my-decorations"
                style={buttonStyle}
              >
                View All Ratings
              </Button>
            </Section>

            <Text style={paragraphStyle}>
              Thank you for being part of our Christmas Lights community!
            </Text>
          </Section>

          <Hr style={dividerStyle} />

          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              © 2025 Christmas Lights App. All rights reserved.
            </Text>
            <Text style={footerTextStyle}>
              To manage your email preferences, click{" "}
              <a
                href="https://christmaslightsapp.com/preferences"
                style={linkStyle}
              >
                here
              </a>
              .
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

const ratingContainerStyle = {
  padding: "10px 15px 15px",
};

const ratingLabelStyle = {
  fontSize: "14px",
  color: "#555555",
  marginBottom: "5px",
};

const ratingValueStyle = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#de3d33",
  marginBottom: "5px",
};

const starRatingStyle = {
  fontSize: "24px",
  color: "#ffc107", // Gold/yellow for stars
  letterSpacing: "2px",
  marginBottom: "10px",
};

const commentStyle = {
  fontSize: "14px",
  fontStyle: "italic",
  backgroundColor: "#f1f1f1",
  padding: "10px",
  borderRadius: "6px",
  borderLeft: "3px solid #de3d33",
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

const linkStyle = {
  color: "#de3d33",
  textDecoration: "underline",
};

export default NewRatingEmail;
