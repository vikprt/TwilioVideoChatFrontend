import React, { useState } from 'react';

export const EventContext = React.createContext({
  events: [],
  users: [],

  setEvent: () => {},
})

export const EventProvider = ({ children }) => {
  const [eventState, setEventState] = useState({
    events: [],
    users: []
  })

  const setEvent = eventData => {
    setEventState({ ...eventState, ...eventData })
  }
  
  return (
    <EventContext.Provider
      value={{
        ...eventState,
        setEvent,
      }}
    >
      {children}
    </EventContext.Provider>
  )
}