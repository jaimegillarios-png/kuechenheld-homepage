import Button from "./ui/Button";
import Section from "./ui/Section";
import SectionHeader from "./ui/SectionHeader";

export default function OfferCompare() {
  return (
    <Section tone="cream" rhythm="tight">
      <SectionHeader
        heading="Haben Sie schon ein Angebot? Vergleichen lohnt sich!"
        lede="Nutzen Sie unseren Angebotsvergleich-Service und sichern Sie sich das bestmögliche Angebot für Ihre Traumküche!"
      >
        <Button
          href="#fragebogen"
          variant="outline"
          data-reveal="rise"
          data-reveal-delay={240}
        >
          Jetzt Angebot vergleichen
        </Button>
      </SectionHeader>
    </Section>
  );
}
