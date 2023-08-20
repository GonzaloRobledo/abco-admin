// eslint-disable-next-line react/prop-types
export const InfoModalSale = ({ data }) => {
  return (
    <ul>
      <li>
        <b>User Email: </b>
        {data.user_id}
      </li>
      <li>
        <b>User Payout: </b>${data.user_payout}
      </li>
      <li>
        <b>Total Payout: </b>
        ${data.total_payout}
      </li>
      <li>
        <b>Where Sell: </b>
        {data.where_sell.name} - {data.where_sell.street}
      </li>
      <li>
        <b>Delivery Method: </b>
        {data.delivery_method[0] == 'inStore' ? 'In Store' : 'Shipping'}
      </li>
      <li>
        <b>Expired in: </b>
        {data.expired} days
      </li>
    </ul>
  )
}
