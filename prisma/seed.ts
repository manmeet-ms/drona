import prisma from '@/src/lib/prisma';
import {  UserRole, ClassStatus, ResourceType } from '../generated/prisma/client';
import { faker } from '@faker-js/faker';



const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography', 'Computer Science', 'Economics'];
const LOCATIONS = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'];

async function main() {
  console.log('🌱 Starting seeding...');

  // Optional: Cleanup existing data (Be careful in production!)
  // await prisma.queryResponse.deleteMany();
  // await prisma.query.deleteMany();
  // await prisma.report.deleteMany();
  // await prisma.homework.deleteMany();
  // await prisma.class.deleteMany();
  // await prisma.resource.deleteMany();
  // await prisma.student.deleteMany();
  // await prisma.tutorProfile.deleteMany();
  // await prisma.user.deleteMany();
 
  // 1. Create Tutors
  console.log('Creating 100 Tutors...');
  const tutors: any[] = [];
  for (let i = 0; i < 100; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName });

    const user = await prisma.user.create({
      data: {
        fullname: `${firstName} ${lastName}`, // Fixed: name -> fullname
        username: email,
        password: 'password123',
        role: UserRole.TUTOR,
        tutorProfile: {
          create: {
            bio: faker.person.bio(),
            subjects: faker.helpers.arrayElements(SUBJECTS, { min: 1, max: 3 }),
            hourlyRate: parseFloat(faker.commerce.price({ min: 300, max: 2000 })),
            location: faker.helpers.arrayElement(LOCATIONS),
            isVerified: faker.datatype.boolean(0.8),
          }
        }
      },
      include: {
        tutorProfile: true
      }
    });
    tutors.push(user);
  }

  // 2. Create Parents and Students
  console.log('Creating 50 Parents and their Students...');
  const parents = [];
  const students = [];

  for (let i = 0; i < 50; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName });

    const parent = await prisma.user.create({
      data: {
        fullname: `${firstName} ${lastName}`, // Fixed: name -> fullname
        username: email,
        password: 'password123',
        role: UserRole.PARENT,
      }
    });
    parents.push(parent);

    // Create 1-3 Students for this parent
    const numStudents = faker.number.int({ min: 1, max: 3 });
    for (let j = 0; j < numStudents; j++) {
      const studentName = faker.person.firstName();
      const student = await prisma.student.create({
        data: {
          name: `${studentName} ${lastName}`,
          parentId: parent.id,
          password: 'password123',
          age: faker.number.int({ min: 6, max: 18 }),
          school: faker.company.name() + ' School',
          interests: faker.helpers.arrayElements(['Sports', 'Music', 'Coding', 'Art', 'Reading'], { min: 1, max: 3 }),
          aspirations: faker.lorem.sentence(),
        }
      });
      students.push(student);
    }
  }

  // 3. Create Classes, Homework, Reports, Queries
  console.log('Generating Activities...');

  for (const student of students) {
    // Assign 1-3 random tutors to each student
    const studentTutors = faker.helpers.arrayElements(tutors, { min: 1, max: 3 });

    for (const tutorUser of studentTutors) {
      if (!tutorUser.tutorProfile) continue;

      // Create 5-10 Classes (Past and Future)
      const numClasses = faker.number.int({ min: 5, max: 10 });
      for (let k = 0; k < numClasses; k++) {
        const isPast = faker.datatype.boolean();
        const date = isPast ? faker.date.recent({ days: 30 }) : faker.date.soon({ days: 30 });
        const status = isPast ? ClassStatus.COMPLETED : ClassStatus.SCHEDULED;

        const cls = await prisma.class.create({
          data: {
            tutorId: tutorUser.tutorProfile.id,
            studentId: student.id,
            scheduledAt: date,
            status: status,
            attendanceToken: status === ClassStatus.SCHEDULED ? faker.string.alphanumeric(6).toUpperCase() : null,
          }
        });

        // If class is completed, maybe add homework
        if (status === ClassStatus.COMPLETED && faker.datatype.boolean(0.7)) {
          await prisma.homework.create({
            data: {
              classId: cls.id,
              studentId: student.id,
              title: `Homework for ${date.toLocaleDateString()}`,
              description: faker.lorem.paragraph(),
              dueDate: faker.date.soon({ days: 7, refDate: date }),
              isCompleted: faker.datatype.boolean(0.6),
            }
          });
        }
      }

      // Create Reports (1-2 per tutor-student pair)
      if (faker.datatype.boolean(0.5)) {
        await prisma.report.create({
          data: {
            studentId: student.id,
            title: `Monthly Progress - ${faker.date.month()}`,
            feedback: faker.lorem.paragraph(),
            grade: faker.helpers.arrayElement(['A', 'B', 'A+', 'B+']),
          }
        });
      }

      // Create Queries (Conversation)
      if (faker.datatype.boolean(0.4)) {
        const context = faker.helpers.arrayElement(['TUTOR_PARENT', 'TUTOR_STUDENT']);
        const senderRole = context === 'TUTOR_PARENT' ? faker.helpers.arrayElement([UserRole.PARENT, UserRole.TUTOR]) : faker.helpers.arrayElement([UserRole.STUDENT, UserRole.TUTOR]);

        const query = await prisma.query.create({
          data: {
            content: faker.lorem.sentence(),
            senderId: senderRole === UserRole.STUDENT ? student.id : (senderRole === UserRole.PARENT ? student.parentId : tutorUser.id),
            senderRole: senderRole,
            tutorId: tutorUser.tutorProfile.id,
            studentId: student.id,
            parentId: student.parentId,
            context: context as any,
          }
        });

        // Add responses
        const numResponses = faker.number.int({ min: 1, max: 5 });
        for (let r = 0; r < numResponses; r++) {
          await prisma.queryResponse.create({
            data: {
              queryId: query.id,
              content: faker.lorem.sentence(),
              senderId: faker.datatype.boolean() ? tutorUser.id : (context === 'TUTOR_PARENT' ? student.parentId : student.id),
              senderRole: UserRole.TUTOR, // Simplified
            }
          });
        }
      }
    }
  }

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });