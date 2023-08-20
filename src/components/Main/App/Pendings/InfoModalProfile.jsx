// eslint-disable-next-line react/prop-types
export const InfoModalProfile = ({ data }) => {
  return (
    <ul>
      <li>
        <b>Email: </b>
        {data.email}
      </li>
      <li>
        <b>Name: </b>
        {data.name}
      </li>
      <li>
        <b>Last Name: </b>
        {data.last_name}
      </li>
      <li>
        <b>Username: </b>
        {data.username}
      </li>
      <li>
        <b>Phone: </b>
        {data.phone}
      </li>
      <li>
        <b>Country: </b>
        {data.country}
      </li>
    </ul>
  )
}
