const logo = [
  {
    width: 17,
    backgroundColor: '#E61C2C'
  },
  {
    width: 17,
    backgroundColor: '#FA6C2C'
  },
  {
    width: 17,
    backgroundColor: '#F7B233'
  },
  {
    width: 9,
    backgroundColor: '#FDED38'
  },
  {
    width: 4,
    backgroundColor: 'white'
  },
  {
    width: 4,
    backgroundColor: '#C8D060'
  },
  {
    width: 20,
    backgroundColor: 'white'
  },

  {
    width: 4,
    backgroundColor: '#D1D1D1'
  },
  {
    width: 4,
    backgroundColor: 'white'
  },
  {
    width: 9,
    backgroundColor: '#9AC2CA'
  },
  {
    width: 17,
    backgroundColor: '#60CDD0'
  },
  {
    width: 17,
    backgroundColor: '#24AEEF'
  },
  {
    width: 17,
    backgroundColor: '#1573B9'
  }
]

export const Logo = () => {
  return (
    <div className='logo'>
      {logo.map((el, index) => (
        <div key={index} style={{ ...el, height: 18 }}></div>
      ))}
    </div>
  )
}
