const EventCard = ({event}) => {


  return (
    <div className="m-3">
      <p>{event.title}</p>
      <p>{event.description}</p>
      <p>{event.startTime}</p>
    </div>
  )
}

export default EventCard