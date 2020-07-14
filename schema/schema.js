const graphql = require("graphql");
const db = require("../databaseConfig");
const _ = require("lodash");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

const CompanyType = new GraphQLObjectType({
  name: "Company",
  fields: () => ({
    cid: { type: GraphQLID },
    name: { type: GraphQLString },
    fname: { type: GraphQLString },
    lname: { type: GraphQLString },
    address1: { type: GraphQLString },
    address2: { type: GraphQLString },
    city: { type: GraphQLString },
    state: { type: GraphQLString },
    categoryid: { type: GraphQLID },
    descr: { type: GraphQLString },
    website: { type: GraphQLString },
    phone: { type: GraphQLString },
    logo: { type: GraphQLString },
    loginid: { type: GraphQLID },
    suggested: { type: GraphQLInt },
    favorite: { type: GraphQLInt },
  }),
});

const CategoryType = new GraphQLObjectType({
  name: "Category",
  fields: () => ({
    catid: { type: GraphQLID },
    name: { type: GraphQLString },
    active: { type: GraphQLInt },
    companys: {
      type: new GraphQLList(CompanyType),
      resolve(parent, args) {
        return db
          .findAllBusinessByCategory(parent.catid)
          .then((value) => value[0]);
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    company: {
      type: CompanyType,
      args: { categoryid: { type: GraphQLID } },
      resolve(parent, args) {},
    },

    category: {
      type: CategoryType,
      args: { name: { type: GraphQLString } },
      resolve(parent, args) {
        return db.findCategoryByName(args.name).then((value) => value[0]);
      },
    },

    companys: {
      type: new GraphQLList(CompanyType),
      args: { categoryid: { type: GraphQLID } },
      resolve(parent, args) {
        return db
          .findAllBusinessByCategory(args.categoryid)
          .then((value) => value[0]);
      },
    },

    categorys: {
      type: new GraphQLList(CategoryType),
      resolve(parent, args) {
        return Author.find({});
      },
    },
  },
});

// const Mutation = new GraphQLObjectType({
//     name: 'Mutation',
//     fields: {
//         addAuthor: {
//             type: AuthorType,
//             args: {
//                 name: { type: GraphQLString },
//                 age: { type: GraphQLInt }
//             },
//             resolve(parent, args){
//                 let author = new Author({
//                     name: args.name,
//                     age: args.age
//                 });
//                 return author.save();
//             }
//         },
//         addBook: {
//             type: BookType,
//             args: {
//                 name: { type: new GraphQLNonNull(GraphQLString) },
//                 genre: { type: new GraphQLNonNull(GraphQLString) },
//                 authorId: { type: new GraphQLNonNull(GraphQLID) }
//             },
//             resolve(parent, args){
//                 let book = new Book({
//                     name: args.name,
//                     genre: args.genre,
//                     authorId: args.authorId
//                 });
//                 return book.save();
//             }
//         }
//     }
// });

module.exports = new GraphQLSchema({
  query: RootQuery,
  // mutation: Mutation
});
