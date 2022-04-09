const objectId = (value, helpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
      return helpers.message('"{{#label}}" must be a valid mongo id');
    }
    return value;
  };


const voteType = (value, helpers) => {
  
  if (["upVote","downVote"].includes(value)) {
    return value;
  }
  return helpers.message("vote is required");
};
const voteChange = (value, helpers) => {
  
  if (["increase","decrease"].includes(value)) {
    return value;
  }
  return helpers.message("vote is required");
};
  
  module.exports = {
    objectId,
    voteType,
    voteChange,
  };
  