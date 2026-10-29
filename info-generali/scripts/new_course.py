import os
import re
import argparse
import unicodedata


def sanitize_prof_folder_name(professor_name: str) -> str:
    """Converte un nome docente (es. 'Luigi Libero Lucio Starace', 'Andrea Calì', 'L. D\\'Amore')
    nello standard CamelCase ASCII puro: 'Prof-LuigiLiberoLucioStarace', 'Prof-AndreaCali', 'Prof-LDAmore'.
    """
    clean = re.sub(r"^Prof\.?\s*", "", professor_name.strip(), flags=re.IGNORECASE)
    # Rimuovi accenti
    nfkd = unicodedata.normalize("NFKD", clean)
    ascii_str = "".join(ch for ch in nfkd if not unicodedata.combining(ch))
    # Dividi su spazi, punti, apostrofi, trattini e ricomponi in PascalCase/CamelCase
    tokens = re.findall(r"[A-Za-z0-9]+", ascii_str)
    camel = "".join(t[0].upper() + t[1:] for t in tokens if t)
    return f"Prof-{camel or 'DaDefinire'}"


def create_course_structure(year: int, semester: int, course_name: str, professor_name: str, cfu: int = 6, propedeuticita: str = "Nessuna", is_scelta: bool = False):
    subfolders = [
        "slides",
        "appunti",
        "esercizi",
        "progetti",
        os.path.join("esami", "scritto"),
        os.path.join("esami", "orale"),
        "libri",
        "contenuto-non-proprio",
    ]

    if is_scelta or year == 0:
        base_course_dir = os.path.join("Esami a Scelta", course_name)
        anno_label = "2° o 3° (Esame a Scelta)"
    else:
        year_dir = "Primo Anno" if year == 1 else ("Secondo Anno" if year == 2 else "Terzo Anno")
        sem_dir = "Primo Semestre" if semester == 1 else "Secondo Semestre"
        base_course_dir = os.path.join(year_dir, sem_dir, course_name)
        anno_label = f"{year}°"

    display_prof = re.sub(r"^Prof\.?\s*", "", professor_name.strip(), flags=re.IGNORECASE)
    prof_dir = sanitize_prof_folder_name(display_prof)
    prof_full_path = os.path.join(base_course_dir, prof_dir)

    print(f"Creating structure for: {prof_full_path}")

    for folder in subfolders:
        path = os.path.join(prof_full_path, folder)
        os.makedirs(path, exist_ok=True)
        gitkeep_path = os.path.join(path, ".gitkeep")
        if not os.path.exists(gitkeep_path):
            with open(gitkeep_path, "w", encoding="utf-8"):
                pass

    prof_readme = os.path.join(prof_full_path, "README.md")
    if not os.path.exists(prof_readme):
        with open(prof_readme, "w", encoding="utf-8") as f:
            f.write(f"# {course_name}\n\n")
            f.write("## Informazioni Corso\n\n")
            f.write(f"* **Docente:** Prof. {display_prof}\n")
            f.write(f"* **Anno:** {anno_label}\n")
            f.write(f"* **Semestre:** {semester}°\n")
            f.write(f"* **CFU:** {cfu}\n")
            f.write("* **Stato:** ⏳ In Corso / Da Sostenere\n\n")
            f.write("Codice Teams 2026/2027: \n")

    course_readme = os.path.join(base_course_dir, "README.md")
    prof_entry = f"- [Prof. {display_prof}](./{prof_dir})"
    if not os.path.exists(course_readme):
        with open(course_readme, "w", encoding="utf-8") as f:
            f.write(f"# {course_name}\n\n")
            f.write("## Informazioni Corso\n")
            f.write(f"- **Anno:** {anno_label}\n")
            f.write(f"- **Semestre:** {semester}°\n")
            f.write(f"- **CFU:** {cfu}\n")
            f.write(f"- **Propedeuticità:** {propedeuticita}\n")
            f.write("- **Stato:** ⏳ In Corso / Da Sostenere\n\n")
            f.write("## Canali e Docenti\n")
            f.write(f"{prof_entry}\n")
    else:
        with open(course_readme, "r", encoding="utf-8") as f:
            content = f.read()
        if f"./{prof_dir}" not in content:
            with open(course_readme, "a", encoding="utf-8") as f:
                if not content.endswith("\n"):
                    f.write("\n")
                f.write(f"{prof_entry}\n")

    print("Structure created successfully!")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Genera la struttura standard per un nuovo corso/docente.")
    parser.add_argument("--anno", type=int, default=1, help="Anno (1, 2, 3 oppure 0 per esame a scelta)")
    parser.add_argument("--semestre", type=int, required=True, help="Semestre (1 o 2)")
    parser.add_argument("--corso", type=str, required=True, help="Nome del corso (Title Case)")
    parser.add_argument("--prof", type=str, required=True, help="Nome e Cognome del professore")
    parser.add_argument("--cfu", type=int, default=6, help="Numero di CFU (default: 6)")
    parser.add_argument("--propedeuticita", type=str, default="Nessuna", help="Esami propedeutici")
    parser.add_argument("--scelta", action="store_true", help="Se il corso è un esame a scelta")

    args = parser.parse_args()
    create_course_structure(
        args.anno,
        args.semestre,
        args.corso,
        args.prof,
        cfu=args.cfu,
        propedeuticita=args.propedeuticita,
        is_scelta=args.scelta,
    )
