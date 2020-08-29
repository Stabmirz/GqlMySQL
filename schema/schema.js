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
    lat: { type: GraphQLFloat},
    lon: { type: GraphQLFloat },
    distance:{ type: GraphQLFloat },
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
    // selected cid as value and name as label in a query to show company name in dropdown
    value: { type: GraphQLID },
    label: { type: GraphQLString },
    rank:{type: GraphQLInt},
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
    extReviews: {
      type: new GraphQLList(ExtReviewsType),
      resolve(parent, args) {
        return db.findExtReviewsById(parent.cid).then((value) => value[0]);
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
    short_name: { type: GraphQLString },
    active: { type: GraphQLInt },
    
    // selected catid as value and short_name as label in a query
    value: { type: GraphQLID },
    label: { type: GraphQLString },
    companys: {
      type: new GraphQLList(CompanyType),
      args:{
        lat: { type: GraphQLFloat },
        lon: { type: GraphQLFloat }
      },
      resolve(parent, args) {
        return db
          .findAllBusinessByCategory(parent.catid, args.lat, args.lon)
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
    reply: {
      type: ReplyType,
      resolve(parent, args) {
        return db
          .findReply(parent.rid)
          .then((value) => value[0]);
      },
    },
    company: {
      type: CompanyType,
      resolve(parent, args) {
        return db
          .findBusinessByID(parent.cid)
          .then((value) => value[0]);
      },
    },
  }),
});

const ReplyType = new GraphQLObjectType({
  name: "Reply",
  fields: () => ({
    id: { type: GraphQLID },
    rid: { type: GraphQLID },
    comment: { type: GraphQLString },
    active:{type:GraphQLInt},
    date: { type: GraphQLString },
  }),
});

const ExtReviewsType = new GraphQLObjectType({
  name: "ExtReviews",
  fields: () => ({
    id: { type: GraphQLID },
    cid: { type: GraphQLID },
    rsi: { type: GraphQLID },
    rating: { type: GraphQLID },
    quantity: { type: GraphQLID },
    date:{ type:GraphQLString },
    source: {
      type: ReviewSourceType,
      resolve(parent, args) {
        return db
          .findReviewSourceByRSI(parent.rsi)
          .then((value) => value[0]);
      },
    },
  }),
});


const ReviewSourceType = new GraphQLObjectType({
  name: "ReviewSource",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    url: { type: GraphQLString },
    logo: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    category: {
      type: CategoryType,
      args: { short_name: { type: GraphQLString } },
      resolve(parent, args) {
        return db.findCategoryByName(args.short_name).then((value) => value[0]);
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
      args: { 
        categoryid: { type: GraphQLID },
        lat: { type: GraphQLFloat },
        lon: { type: GraphQLFloat }
     },
      resolve(parent, args) {
        return db
          .findAllBusinessByCategory(args.categoryid, args.lat, args.lon)
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

    extReviews: {
      type: new GraphQLList(ExtReviewsType),
      args: { cid: { type: GraphQLID } },
      resolve(parent, args) {
        return db.findExtReviewsById(args.cid).then((value) => value[0]);
      },
    },

    source:{
      type: ReviewSourceType,
      args: { rsi: { type: GraphQLID } },
      resolve(parent, args) {
        return db
          .findReviewSourceByRSI(args.rsi)
          .then((value) => value[0]);
      },

    },

    review: {
      type: ReviewsType,
      args: { rid: { type: GraphQLID } },
      resolve(parent, args) {
        return db.findReview(args.rid).then((value) => value[0]);
      },
    },

    reply: {
      type: ReplyType,
      args: { rid: { type: GraphQLID } },
      resolve(parent, args) {
        return db.findReply(args.rid).then((value) => value[0]);
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

    allApprovedCompanys: {
      type: new GraphQLList(CompanyType),
      args: { 
        lat: { type: GraphQLFloat },
        lon: { type: GraphQLFloat }
      },
      resolve(parent, args) {
        return db.findAllApprovedCompanys(args.lat, args.lon).then((value) => value[0]);
      },
    },

    allCategories: {
      type: new GraphQLList(CategoryType),
      resolve(parent, args) {
        return db.findAllCategories().then((value) => value[0]);
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
        lat: { type: new GraphQLNonNull(GraphQLFloat) },
        lon: { type: new GraphQLNonNull(GraphQLFloat) },
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
        let lat = args.lat;
        let lon = args.lon;
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
            lat,
            lon,
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
        zip: { type: GraphQLString },
        categoryid: { type: new GraphQLNonNull(GraphQLID) },
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

    updateBusinessHours: {
      type: HoursType,
      args: {
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
      },
      resolve(parent, args) {
        let cid= args.cid;
        let monstart=args.monstart;
        let monend=args.monend;
        let tuestart=args.tuestart;
        let tueend=args.tueend;
        let wedstart=args.wedstart;
        let wedend=args.wedend;
        let thustart=args.thustart;
        let thuend=args.thuend;
        let fristart=args.fristart;
        let friend=args.friend;
        let satstart=args.satend;
        let satend=args.satstart;
        let sunstart=args.sunstart;
        let sunend=args.sunend;
        return db
          .updateBusinessHours(
            cid,
            monstart,
            monend,
            tuestart,
            tueend,
            wedstart,
            wedend,
            thustart,
            thuend,
            fristart,
            friend,
            satstart,
            satend,
            sunstart,
            sunend,
          )
          .then((value) => value[0]);
      },
    },

    updateCity: {
      type: CompanyType,
      args: {
        cid: { type: new GraphQLNonNull(GraphQLID) },
        city: { type: new GraphQLNonNull(GraphQLString) },
        lat: { type: new GraphQLNonNull(GraphQLFloat) },
        lon: { type: new GraphQLNonNull(GraphQLFloat) },
      },
      resolve(parent, args) {
        let cid= args.cid;
        let city = args.city;
        let lat = args.lat;
        let lon = args.lon;
        return db
          .updateCity(
            cid,
            city,
            lat,
            lon
          )
          .then((value) => value[0]);
      },
    },

    updateLocation: {
      type: ReviewerType,
      args: {
        loginid: { type: new GraphQLNonNull(GraphQLID) },
        city: { type: new GraphQLNonNull(GraphQLString) },
        state: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        let loginid= args.loginid;
        let city = args.city;
        let state = args.state;
        return db
          .updateReviewerLocation(
            loginid,
            city,
            state
          )
          .then((value) => value[0]);
      },
    },

    updateReview: {
      type: ReviewsType,
      args: {
        rid: { type: new GraphQLNonNull(GraphQLID) },
        active: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
        let rid = args.rid;
        let active = args.active;

        return db
          .updateReview(rid, active)
          .then((value) => value[0]);
      },
    },

    validateAccount: {
      type: UserType,
      args: {
        loginid: { type: new GraphQLNonNull(GraphQLID) },
        active: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
        let loginid = args.loginid;
        let active = args.active;

        return db
          .validateAccount(loginid, active)
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

    addReply: {
      type: ReplyType,
      args: {
        rid: { type: new GraphQLNonNull(GraphQLID) },
        comment: { type: new GraphQLNonNull(GraphQLString) },
        active: { type: GraphQLInt },
      },

      resolve(parent, args) {
        let rid = args.rid;
        let comment = args.comment;
        let active = args.active;
        return db
          .addReply(
            rid,
            comment,
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
