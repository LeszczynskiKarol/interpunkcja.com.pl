# Buduje plik testowy praca-testowa.docx bez zewnętrznych bibliotek (.docx to ZIP z XML).
# Treść: typowe błędy interpunkcyjne i pisownia łączna/rozdzielna, pogrubienie w środku
# zdania, cytat innego autora (nie do poprawiania) i bibliografia (nie do poprawiania).
# Użycie: python make-test-docx.py [plik_wyjsciowy]
import sys
import zipfile
from xml.sax.saxutils import escape

OUT = sys.argv[1] if len(sys.argv) > 1 else "praca-testowa.docx"

PARAGRAPHS = [
    ("heading", "Rozdział 2. Komunikacja w zespołach rozproszonych"),
    ("p", "Praca zdalna zmieniła sposób w jaki zespoły się komunikują. Badania pokazują że w zespołach rozproszonych rośnie znaczenie komunikacji pisemnej."),
    ("bold", ["Pracując zdalnie ", "pracownicy", " częściej korzystają z komunikatorów niż z poczty elektronicznej. Wynika to z tego że komunikatory są szybsze."]),
    ("p", "Jak zauważa Nowak „komunikacja w zespole zdalnym wymaga jasnych reguł, w przeciwnym razie powstaje chaos informacyjny” (Nowak 2021, s. 45). Autor podkreśla że bez zasad zespół traci czas."),
    ("p", "Zespoły które pracują w różnych strefach czasowych muszą planować spotkania z wyprzedzeniem."),
    ("p", "Wogóle warto zauważyć, że menedżerowie napewno powinni dbać o regularny kontakt z zespołem."),
    ("p", "W badaniu sprawdzono czy częstotliwość spotkań wpływa na zadowolenie z pracy. Okazało się że wystarcza jedna krótka rozmowa w tygodniu."),
    ("heading", "Bibliografia"),
    ("p", "Nowak J. (2021), Zarządzanie zespołem zdalnym, Wydawnictwo Naukowe PWN, Warszawa."),
    ("p", "Kowalski A. (2019), Komunikacja w organizacji ktora sie zmienia, Difin, Warszawa."),
]


def run(text, bold=False):
    rpr = "<w:rPr><w:b/></w:rPr>" if bold else ""
    return f'<w:r>{rpr}<w:t xml:space="preserve">{escape(text)}</w:t></w:r>'


body = []
for kind, value in PARAGRAPHS:
    if kind == "heading":
        body.append(f'<w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr>{run(value, bold=True)}</w:p>')
    elif kind == "bold":
        body.append("<w:p>" + run(value[0]) + run(value[1], bold=True) + run(value[2]) + "</w:p>")
    else:
        body.append(f"<w:p>{run(value)}</w:p>")

W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
document = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    f'<w:document xmlns:w="{W}"><w:body>{"".join(body)}'
    '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/></w:sectPr></w:body></w:document>'
)
content_types = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
    '<Default Extension="xml" ContentType="application/xml"/>'
    '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>'
    "</Types>"
)
rels = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>'
    "</Relationships>"
)
doc_rels = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>'
)

with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED) as z:
    z.writestr("[Content_Types].xml", content_types)
    z.writestr("_rels/.rels", rels)
    z.writestr("word/document.xml", document)
    z.writestr("word/_rels/document.xml.rels", doc_rels)
print("zapisano", OUT)
