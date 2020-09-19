import axios from 'axios';
import { useState } from 'react';

export default ({ url, method, body, onSuccess }) => {
  let [ errors, setErrors ] = useState(null);

  let doRequest = async (props = {}) => {
    try {
      setErrors(null);

      let response = await axios[method](url, { ...body, ...props });

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } 
    catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <h4> Ooops.... </h4>
          <ul className="my-0">
            {
              err.response.data.errors.map((err, i) => (
                <li key={ i }>{ err.message }</li>
              ))
            }
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};
