import { faker } from '@faker-js/faker';
import pkg from 'lodash';
import db, { genId } from './db/index.js';

const { random } = pkg;

const submission = async () => {
  return await db.submission.create({
    data: {
      id: genId(),
      submittedAt: new Date(),
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        company: faker.company.name(),
        comments: faker.lorem.words(random(30, false)),
      },
    },
  });
};

const ModGenerate = {
  submission,
};

export default ModGenerate;
