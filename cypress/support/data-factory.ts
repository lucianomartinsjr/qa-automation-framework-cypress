import { faker } from "@faker-js/faker";

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export interface NewPost {
  title: string;
  body: string;
  userId: number;
}

export interface UserRegistration {
  email: string;
  password: string;
}

/**
 * Data Factory — generates dynamic test data using Faker.
 * Avoids hardcoded values and ensures unique data per test run.
 */
export const DataFactory = {
  checkout: {
    validInfo(): CheckoutInfo {
      return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        postalCode: faker.location.zipCode("#####")
      };
    },

    invalidInfo(): CheckoutInfo {
      return {
        firstName: "",
        lastName: "",
        postalCode: ""
      };
    },

    partialInfo(): CheckoutInfo {
      return {
        firstName: faker.person.firstName(),
        lastName: "",
        postalCode: faker.location.zipCode("#####")
      };
    }
  },

  api: {
    newPost(): NewPost {
      return {
        title: faker.lorem.sentence(),
        body: faker.lorem.paragraph(),
        userId: faker.number.int({ min: 1, max: 10 })
      };
    },

    updatedPost(): NewPost {
      return {
        title: `Updated: ${faker.lorem.sentence()}`,
        body: faker.lorem.paragraph(),
        userId: faker.number.int({ min: 1, max: 10 })
      };
    },

    userRegistration(valid = true): UserRegistration {
      return {
        email: valid ? "eve.holt@reqres.in" : faker.internet.email(),
        password: valid ? "pistol" : faker.internet.password()
      };
    },

    userLogin(valid = true): UserRegistration {
      return {
        email: valid ? "eve.holt@reqres.in" : "peter@klaven",
        password: valid ? "cityslicka" : ""
      };
    }
  }
};
