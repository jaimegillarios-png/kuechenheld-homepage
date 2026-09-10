# -*- coding: utf-8 -*-
"""
CTA label normalisation.

223 buttons carried 68 distinct labels. They fall into two generic families —
"start planning" and "request a quote" — plus about forty that name the post's
own subject (a brand, a material, a colour, a layout). The generic families
collapse onto one canonical string each; the topic-specific ones are editorial
copy and are kept verbatim.
"""

PLANNING = "Kostenlose Küchenplanung starten"
QUOTE = "Unverbindliches Angebot anfordern"

# Everything here is a near-duplicate of one of the two canonical labels:
# a case difference, a filler word, a truncation, or a typo.
NORMALISE = {
    # --- start planning -----------------------------------------------------
    "Küchenplanung starten": PLANNING,
    "kostenlose Küchenplanung starten": PLANNING,
    "Kostenlose Küchenplanung starten": PLANNING,
    "Jetzt kostenlose Küchenplanung starten": PLANNING,
    "Konstenlose Küchenplanung starten": PLANNING,        # typo: Konstenlose
    "konstenlose Küchenplanung starten": PLANNING,        # typo: konstenlose
    "Kostenlose Küchenplanung starte": PLANNING,          # truncated: starte
    "Starten Sie hier Ihre kostenlose Küchenplanung!": PLANNING,
    "Starten Sie Ihre kostenlose Küchenplanung": PLANNING,
    "Starten Sie jetzt Ihre Küchenplanung": PLANNING,
    "Jetzt Küche kostenlos planen!": PLANNING,
    "Wir erstellen Ihre kostenlose Küchenplanung": PLANNING,
    "Wir erstellen Ihre kostenlose Küchenplanung!": PLANNING,
    "Wir planen Ihre Küche": PLANNING,
    "Wir planen Ihre Traumküche": PLANNING,
    "Wir planen die Küche ganz nach Ihren Wünschen": PLANNING,
    "Gestalten Sie Ihre Küche ganz nach Ihren Vorstellungen": PLANNING,
    # --- request a quote ----------------------------------------------------
    "Unverbindliches Angebot Ihrer Küche anfordern": QUOTE,
    "Unverbindliches Angebot Ihrer Traumküche anfordern": QUOTE,
    "Unverbindliches Angebot für Ihre Traumküche anfordern": QUOTE,
    "Unverbindliches Angebot Ihrer Wunschküche anfordern": QUOTE,
    "unverbindliches Angebot anfordern": QUOTE,
    "Angebot anfordern": QUOTE,
}

# Kept verbatim: these name the post's own subject and carry editorial intent
# that a generic label would throw away. Listed so the set is auditable.
KEEP_VERBATIM_PREFIXES = (
    "Jetzt ", "Küche ", "Küchenplanung mit", "Küchenplanung nach",
    "Planen Sie", "Planung Ihrer", "Angebot für", "Angebot Ihrer",
    "Beratung:", "Dunkle", "Erhalte", "Ideen", "Umweltfreundliche",
    "Kostenlose Beratung", "Badmöbel", "Zu Ihrem Angebot",
)

def normalise(label: str):
    """Returns (label, was_changed, reason)."""
    clean = " ".join(label.split())
    if clean in NORMALISE:
        out = NORMALISE[clean]
        return out, out != clean, "normalised to canonical"
    return clean, clean != label, "kept verbatim (topic-specific)"
