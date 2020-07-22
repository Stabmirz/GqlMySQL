const graphql = require("graphql");
const db = require("../databaseConfig");
const _ = require("lodash");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    loginid: { type: GraphQLID },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    type: { type: GraphQLString },
    fname: { type: GraphQLString },
    lname: { type: GraphQLString },
    active: { type: GraphQLInt },
    ownerCompany: {
      type: CompanyType,
      resolve(parent, args) {
        return db
          .findBusinessByLoginId(parent.loginid)
          .then((value) => value[0]);
      },
    },
  }),
});

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
    zip: { type: GraphQLString },
    categoryid: { type: GraphQLID },
    descr: { type: GraphQLString },
    website: { type: GraphQLString },
    phone: { type: GraphQLString },
    logo: { type: GraphQLString },
    loginid: { type: GraphQLID },
    suggested: { type: GraphQLInt },
    favorite: { type: GraphQLInt },
    approved: { type: GraphQLInt },
    hours: {
      type: HoursType,
      resolve(parent, args) {
        return db.findHoursById(parent.cid).then((value) => value[0]);
      },
    },
    ratings: {
      type: RatingsType,
      resolve(parent, args) {
        return db.findRatingsById(parent.cid).then((value) => value[0]);
      },
    },
    reviews: {
      type: new GraphQLList(ReviewsType),
      resolve(parent, args) {
        return db.findReviewsById(parent.cid).then((value) => value[0]);
      },
    },
    owner: {
      type: UserType,
      resolve(parent, args) {
        return db.findOwnerByLoginId(parent.loginid).then((value) => value[0]);
      },
    },
    categoryname: {
      type: CategoryType,
      resolve(parent, args) {
        return db
          .findCategoryByCatId(parent.categoryid)
          .then((value) => value[0]);
      },
    },
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

const HoursType = new GraphQLObjectType({
  name: "Hours",
  fields: () => ({
    cid: { type: GraphQLID },
    monstart: { type: GraphQLString },
    monend: { type: GraphQLString },
    tuestart: { type: GraphQLString },
    tueend: { type: GraphQLString },
    wedstart: { type: GraphQLString },
    wedend: { type: GraphQLString },
    thustart: { type: GraphQLString },
    thuend: { type: GraphQLString },
    fristart: { type: GraphQLString },
    friend: { type: GraphQLString },
    satstart: { type: GraphQLString },
    satend: { type: GraphQLString },
    sunstart: { type: GraphQLString },
    sunend: { type: GraphQLString },
  }),
});

const RatingsType = new GraphQLObjectType({
  name: "Ratings",
  fields: () => ({
    cid: { type: GraphQLID },
    rating: { type: GraphQLID },
    revcount: { type: GraphQLID },
    ranking: { type: GraphQLID },
  }),
});

const ReviewerType = new GraphQLObjectType({
  name: "Reviewer",
  fields: () => ({
    reviewerid: { type: GraphQLID },
    fname: { type: GraphQLString },
    lname: { type: GraphQLString },
    city: { type: GraphQLString },
    state: { type: GraphQLString },
    loginid: { type: GraphQLID },
    reviewerReviews: {
      type: new GraphQLList(ReviewsType),
      resolve(parent, args) {
        return db
          .findReviewsByReviewerId(parent.reviewerid)
          .then((value) => value[0]);
      },
    },
  }),
});

const ReviewsType = new GraphQLObjectType({
  name: "Reviews",
  fields: () => ({
    rid: { type: GraphQLID },
    cid: { type: GraphQLID },
    reviewerid: { type: GraphQLID },
    quality: { type: GraphQLInt },
    value: { type: GraphQLInt },
    timeliness: { type: GraphQLInt },
    experience: { type: GraphQLInt },
    satisfaction: { type: GraphQLInt },
    overall: { type: GraphQLFloat },
    comments: { type: GraphQLString },
    fname: { type: GraphQLString },
    lname: { type: GraphQLString },
    email: { type: GraphQLString },
    active: { type: GraphQLInt },
    date: { type: GraphQLString },
    reviewer: {
      type: ReviewerType,
      resolve(parent, args) {
        return db
          .findReviewerByReviewId(parent.reviewerid)
          .then((value) => value[0]);
      },
    },
    company: {
      type: CompanyType,
      resolve(parent, args) {
        return db
          .findAllBusinessByCategory(parent.cid)
          .then((value) => value[0]);
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    category: {
      type: CategoryType,
      args: { name: { type: GraphQLString } },
      resolve(parent, args) {
        return db.findCategoryByName(args.name).then((value) => value[0]);
      },
    },

    categoryname: {
      type: CategoryType,
      args: { catid: { type: GraphQLID } },
      resolve(parent, args) {
        return db.findCategoryByCatId(args.catid).then((value) => value[0]);
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

    company: {
      type: CompanyType,
      args: { cid: { type: GraphQLID } },
      resolve(parent, args) {
        return db.findBusinessByID(args.cid).then((value) => value[0]);
      },
    },

    hours: {
      type: HoursType,
      args: { cid: { type: GraphQLID } },
      resolve(parent, args) {
        return db.findHoursById(args.cid).then((value) => value[0]);
      },
    },

    ratings: {
      type: RatingsType,
      args: { cid: { type: GraphQLID } },
      resolve(parent, args) {
        return db.findRatingsById(args.cid).then((value) => value[0]);
      },
    },

    reviews: {
      type: new GraphQLList(ReviewsType),
      args: { cid: { type: GraphQLID } },
      resolve(parent, args) {
        return db.findReviewsById(args.cid).then((value) => value[0]);
      },
    },

    owner: {
      type: UserType,
      args: { loginid: { type: GraphQLID } },
      resolve(parent, args) {
        return db.findOwnerByLoginId(args.loginid).then((value) => value[0]);
      },
    },

    reviewer: {
      type: ReviewerType,
      args: { reviewerid: { type: GraphQLID } },
      resolve(parent, args) {
        return db
          .findReviewerByReviewId(args.reviewerid)
          .then((value) => value[0]);
      },
    },

    reviewerId: {
      type: ReviewerType,
      args: { loginid: { type: GraphQLID } },
      resolve(parent, args) {
        return db
          .findReviewerByLoginId(args.loginid)
          .then((value) => value[0]);
      },
    },

    reviewerReviews: {
      type: new GraphQLList(ReviewsType),
      args: { reviewerid: { type: GraphQLID } },
      resolve(parent, args) {
        return db
          .findReviewsByReviewerId(args.reviewerid)
          .then((value) => value[0]);
      },
    },

    user: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(parent, args) {
        return db
          .findUserByEmail(args.email, args.password)
          .then((value) => value[0]);
      },
    },

    allCompanys: {
      type: new GraphQLList(CompanyType),
      resolve(parent, args) {
        return db.findAllCompanys().then((value) => value[0]);
      },
    },

    ownerCompany: {
      type: CompanyType,
      args: {
        loginid: { type: GraphQLID },
      },
      resolve(parent, args) {
        return db.findBusinessByLoginId(args.loginid).then((value) => value[0]);
      },
    },

    checkEmail: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
      },
      resolve(parent, args) {
        return db.checkEmail(args.email).then((value) => value[0]);
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addBusiness: {
      type: CompanyType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        fname: { type: GraphQLString },
        lname: { type: GraphQLString },
        address1: { type: GraphQLString },
        address2: { type: GraphQLString },
        city: { type: new GraphQLNonNull(GraphQLString) },
        state: { type: new GraphQLNonNull(GraphQLString) },
        zip: { type: GraphQLString },
        categoryid: { type: GraphQLID },
        descr: { type: GraphQLString },
        website: { type: new GraphQLNonNull(GraphQLString) },
        phone: { type: GraphQLString },
        logo: { type: GraphQLString },
        loginid: { type: GraphQLID },
        suggested: { type: GraphQLInt },
        favorite: { type: GraphQLInt },
        approved: { type: GraphQLInt },
      },
      resolve(parent, args) {
        let name = args.name;
        let fname = args.fname;
        let lname = args.lname;
        let address1 = args.address1;
        let address2 = args.address2;
        let city = args.city;
        let state = args.state;
        let zip = args.zip;
        let categoryid = args.categoryid;
        let descr = args.descr;
        let website = args.website;
        let phone = args.phone;
        let logo = args.logo;
        let loginid = args.loginid;
        let suggested = args.suggested;
        let favorite = args.favorite;
        let approved = args.approved;
        return db
          .addBusiness(
            name,
            fname,
            lname,
            address1,
            address2,
            city,
            state,
            zip,
            categoryid,
            descr,
            website,
            phone,
            logo,
            loginid,
            suggested,
            favorite,
            approved
          )
          .then((value) => value[0]);
      },
    },

    updateBusiness: {
      type: CompanyType,
      args: {
        cid: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        fname: { type: GraphQLString },
        lname: { type: GraphQLString },
        address1: { type: GraphQLString },
        address2: { type: GraphQLString },
        city: { type: new GraphQLNonNull(GraphQLString) },
        state: { type: new GraphQLNonNull(GraphQLString) },
        zip: { type: GraphQLString },
        categoryid: { type: GraphQLID },
        descr: { type: GraphQLString },
        website: { type: new GraphQLNonNull(GraphQLString) },
        phone: { type: GraphQLString },
        suggested: { type: GraphQLInt },
        favorite: { type: GraphQLInt },
        approved: { type: GraphQLInt },
      },
      resolve(parent, args) {
        let cid= args.cid;
        let name = args.name;
        let fname = args.fname;
        let lname = args.lname;
        let address1 = args.address1;
        let address2 = args.address2;
        let city = args.city;
        let state = args.state;
        let zip = args.zip;
        let categoryid = args.categoryid;
        let descr = args.descr;
        let website = args.website;
        let phone = args.phone;
        let suggested = args.suggested;
        let favorite = args.favorite;
        let approved = args.approved;
        return db
          .updateBusiness(
            cid,
            name,
            fname,
            lname,
            address1,
            address2,
            city,
            state,
            zip,
            categoryid,
            descr,
            website,
            phone,
            suggested,
            favorite,
            approved
          )
          .then((value) => value[0]);
      },
    },

    addUser: {
      type: UserType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        fname: { type: new GraphQLNonNull(GraphQLString) },
        lname: { type: new GraphQLNonNull(GraphQLString) },
        type: { type: new GraphQLNonNull(GraphQLString) },
        active: { type: GraphQLInt },
      },
      resolve(parent, args) {
        let email = args.email;
        let password = args.password;
        let fname = args.fname;
        let lname = args.lname;
        let type = args.type;
        let active = args.active;

        return db
          .addUser(email, password, type, fname, lname, active)
          .then((value) => value[0]);
      },
    },

    addReviewer: {
      type: ReviewerType,
      args: {
        fname: { type: new GraphQLNonNull(GraphQLString) },
        lname: { type: new GraphQLNonNull(GraphQLString) },
        loginid: { type: GraphQLID },
      },
      resolve(parent, args) {
        let fname = args.fname;
        let lname = args.lname;
        let loginid = args.loginid;

        return db
          .addReviewer(fname, lname, loginid)
          .then((value) => value[0]);
      },
    },

    addReview: {
      type: ReviewsType,
      args: {
        cid: { type: new GraphQLNonNull(GraphQLID) },
        reviewerid: { type: GraphQLID },
        quality: { type: GraphQLInt },
        value: { type: GraphQLInt },
        timeliness: { type: GraphQLInt },
        experience: { type: GraphQLInt },
        satisfaction: { type: GraphQLInt },
        overall: { type: GraphQLFloat},
        comments: { type: GraphQLString },
        fname: { type: new GraphQLNonNull(GraphQLString) },
        lname: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        active: { type: GraphQLInt },
      },

      resolve(parent, args) {
        console.log(args);
        let cid = args.cid;
        let reviewerid = args.reviewerid;
        let quality = args.quality;
        let value = args.value;
        let timeliness = args.timeliness;
        let experience = args.experience;
        let satisfaction = args.satisfaction;
        let overall = args.overall;
        let comments = args.comments;
        let fname = args.fname;
        let lname = args.lname;
        let email = args.email;
        let active = args.active;
        return db
          .addReview(
            cid,
            reviewerid,
            quality,
            value,
            timeliness,
            experience,
            satisfaction,
            overall,
            comments,
            fname,
            lname,
            email,
            active
          )
          .then((value) => value[0]);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
