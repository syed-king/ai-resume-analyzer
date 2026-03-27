import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';

export interface ResumeData {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    linkedin: string;
    location: string;
  };
  summary: string;
  experience: {
    company: string;
    role: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    bullets: string;
  }[];
  education: {
    institution: string;
    degree: string;
    graduationDate: string;
    gpa: string;
  }[];
  projects: {
    name: string;
    description: string;
    technologies: string;
  }[];
  skills: string;
}

const createHeading = (text: string) => {
  return new Paragraph({
    text: text.toUpperCase(),
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    border: {
      bottom: { color: "000000", space: 1, style: BorderStyle.SINGLE, size: 6 }
    }
  });
};

export const generateDocx = async (data: ResumeData) => {
  const children: Paragraph[] = [];

  // 1. Personal Info (Centered)
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: data.personal.fullName || 'YOUR NAME', bold: true, size: 36, font: 'Arial' }),
      ],
      spacing: { after: 100 }
    })
  );

  const contactText = [data.personal.location, data.personal.email, data.personal.phone, data.personal.linkedin]
    .filter(Boolean)
    .join('  |  ');

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: contactText, size: 20, font: 'Arial' })],
      spacing: { after: 200 }
    })
  );

  // 2. Professional Summary
  if (data.summary?.trim()) {
    children.push(createHeading("Professional Summary"));
    children.push(
      new Paragraph({
        children: [new TextRun({ text: data.summary, size: 22, font: 'Arial' })],
        spacing: { after: 120 }
      })
    );
  }

  // 3. Experience
  if (data.experience && data.experience.length > 0) {
    children.push(createHeading("Experience"));
    for (const exp of data.experience) {
      if (!exp.company && !exp.role) continue;
      
      const dates = exp.current ? `${exp.startDate} - Present` : `${exp.startDate} - ${exp.endDate}`;
      
      children.push(
        new Paragraph({
          tabStops: [{ type: "right", position: 9000 }],
          children: [
            new TextRun({ text: exp.role || 'Role', bold: true, size: 24, font: 'Arial' }),
            new TextRun({ text: `\t${dates}`, bold: true, size: 22, font: 'Arial' })
          ],
          spacing: { before: 120 }
        })
      );
      
      children.push(
        new Paragraph({
          tabStops: [{ type: "right", position: 9000 }],
          children: [
            new TextRun({ text: exp.company || 'Company', italics: true, size: 22, font: 'Arial' }),
            new TextRun({ text: `\t${exp.location || ''}`, font: 'Arial', size: 22 })
          ],
          spacing: { after: 60 }
        })
      );

      if (exp.bullets) {
        const bullets = exp.bullets.split('\n').map(b => b.trim()).filter(Boolean);
        for (const bullet of bullets) {
          children.push(
            new Paragraph({
              text: bullet,
              bullet: { level: 0 },
              style: "ListParagraph",
              spacing: { after: 60 },
              children: [new TextRun({ text: bullet, size: 22, font: 'Arial' })]
            })
          );
        }
      }
    }
  }

  // 4. Projects
  if (data.projects && data.projects.length > 0) {
    children.push(createHeading("Projects"));
    for (const proj of data.projects) {
      if (!proj.name) continue;
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: proj.name, bold: true, size: 22, font: 'Arial' }),
            new TextRun({ text: proj.technologies ? ` | ${proj.technologies}` : '', italics: true, size: 22, font: 'Arial' })
          ],
          spacing: { before: 120, after: 60 }
        })
      );
      if (proj.description) {
        children.push(
          new Paragraph({
            text: proj.description,
            bullet: { level: 0 },
            style: "ListParagraph",
            spacing: { after: 60 },
            children: [new TextRun({ text: proj.description, size: 22, font: 'Arial' })]
          })
        );
      }
    }
  }

  // 5. Education
  if (data.education && data.education.length > 0) {
    children.push(createHeading("Education"));
    for (const edu of data.education) {
      if (!edu.institution) continue;
      children.push(
        new Paragraph({
          tabStops: [{ type: "right", position: 9000 }],
          children: [
            new TextRun({ text: edu.institution, bold: true, size: 24, font: 'Arial' }),
            new TextRun({ text: `\t${edu.graduationDate || ''}`, bold: true, size: 22, font: 'Arial' })
          ],
          spacing: { before: 120 }
        })
      );
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.degree, italics: true, size: 22, font: 'Arial' }),
            new TextRun({ text: edu.gpa ? ` | GPA: ${edu.gpa}` : '', size: 22, font: 'Arial' })
          ],
          spacing: { after: 120 }
        })
      );
    }
  }

  // 6. Skills
  if (data.skills?.trim()) {
    children.push(createHeading("Skills"));
    children.push(
      new Paragraph({
        children: [new TextRun({ text: data.skills, size: 22, font: 'Arial' })],
        spacing: { after: 120 }
      })
    );
  }

  const doc = new Document({
    sections: [{
      properties: {
        page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } }
      },
      children: children
    }]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${data.personal.fullName?.replace(/\s+/g, '_') || 'Top_ATS'}_Resume.docx`);
};
