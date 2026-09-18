import os
import argparse

def create_course_structure(year, semester, course_name, professor_name, is_scelta=False):
    # Standard 8 subfolder paths
    subfolders = [
        'slides',
        'appunti',
        'esercizi',
        'progetti',
        os.path.join('esami', 'scritto'),
        os.path.join('esami', 'orale'),
        'libri',
        'contenuto-non-proprio'
    ]
    
    # Construct the path
    if is_scelta or year == 0:
        base_course_dir = os.path.join("Esami a Scelta", course_name)
    else:
        year_dir = "Primo Anno" if year == 1 else ("Secondo Anno" if year == 2 else "Terzo Anno")
        sem_dir = "Primo Semestre" if semester == 1 else "Secondo Semestre"
        base_course_dir = os.path.join(year_dir, sem_dir, course_name)
        
    prof_dir = f"Prof-{professor_name}"
    prof_full_path = os.path.join(base_course_dir, prof_dir)
    
    print(f"Creating structure for: {prof_full_path}")
    
    for folder in subfolders:
        path = os.path.join(prof_full_path, folder)
        os.makedirs(path, exist_ok=True)
        # Create .gitkeep to ensure empty folders are tracked by Git
        gitkeep_path = os.path.join(path, ".gitkeep")
        if not os.path.exists(gitkeep_path):
            with open(gitkeep_path, "w", encoding="utf-8") as f:
                pass
                
    # Create / update professor README.md
    prof_readme = os.path.join(prof_full_path, "README.md")
    if not os.path.exists(prof_readme):
        with open(prof_readme, "w", encoding="utf-8") as f:
            f.write(f"# {course_name}\n\n")
            f.write(f"## Informazioni Corso\n\n")
            f.write(f"* **Docente:** Prof. {professor_name}\n")
            f.write(f"* **Anno:** {'2 o 3 (Esame a Scelta)' if is_scelta or year == 0 else year}\n")
            f.write(f"* **Semestre:** {semester}\n")
            f.write(f"* **Stato:** ⏳ In Corso\n\n")
            f.write(f"Codice Teams 2026/2027: \n")

    # Create / update course-level README.md
    course_readme = os.path.join(base_course_dir, "README.md")
    if not os.path.exists(course_readme):
        with open(course_readme, "w", encoding="utf-8") as f:
            f.write(f"# {course_name}\n\n")
            f.write(f"## Informazioni Corso\n")
            f.write(f"- **Anno:** {'2 o 3 (Esame a Scelta)' if is_scelta or year == 0 else year}\n")
            f.write(f"- **Semestre:** {semester}\n")
            f.write(f"- **Stato:** ⏳ In Corso\n\n")
            f.write(f"## Professori\n")
            f.write(f"- [Prof. {professor_name}](./{prof_dir})\n")
    else:
        # If course README already exists, append prof if not already listed
        content = open(course_readme, "r", encoding="utf-8").read()
        prof_entry = f"- [Prof. {professor_name}](./{prof_dir})"
        if prof_dir not in content:
            with open(course_readme, "a", encoding="utf-8") as f:
                f.write(f"{prof_entry}\n")

    print("Structure created successfully!")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Genera la struttura standard per un nuovo corso.")
    parser.add_argument("--anno", type=int, default=1, help="Anno (1, 2, 3 oppure 0 per esame a scelta)")
    parser.add_argument("--semestre", type=int, required=True, help="Semestre (1, 2)")
    parser.add_argument("--corso", type=str, required=True, help="Nome del corso")
    parser.add_argument("--prof", type=str, required=True, help="Nome del professore")
    parser.add_argument("--scelta", action="store_true", help="Se il corso è un esame a scelta")
    
    args = parser.parse_args()
    create_course_structure(args.anno, args.semestre, args.corso, args.prof, is_scelta=args.scelta)
