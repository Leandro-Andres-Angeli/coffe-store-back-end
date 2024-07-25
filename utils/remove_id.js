function remove_id() {
  return { projection: { _id: false } };
}
module.exports = remove_id;
