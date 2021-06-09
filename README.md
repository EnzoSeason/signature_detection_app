# signature_detection_app

A web application for signature detection.

There are 3 features.

- [detect the signature](##Detect-the-signature) in an image

- [correct the error](##Correct-the-error) in the detection result

- [add a signature](##Add) to the result

Finally, user can download the result as a json file.

## Detect the signature

![detect](./img/detect.gif)

## Correct the error

![correct_error](./img/correct_error.gif)

## Add a signature

![add_signature](./img/add_signature.gif)

## Install

This application is shipped with Docker.

After downloading the codes, you can run it in 2 modes.

`dev` mode:

```command
docker-compose up
```

`production` mode:

```command
docker-compose -f docker-compose.yml up
```

That's all! The application is run at [localhost](http://localhost/).

## Structure

The application is composed by 3 parts.

- frontend

  It is created by [CRA (create-reat-app)](https://github.com/facebook/create-react-app), written by Typescript.

- backend

  It uses [fastapi](https://github.com/tiangolo/fastapi), a Python web framework.

- web server

  The web server is Nginx. It proxys the requests.

For now, no database is connected. It's very easy to extend with `docker-compose`.

## Testing

- Frontend:

  CRA includes the testing-library.

  To test the file you create or modify, run:

  ```command
  cd signature_detection_app/frontend
  npm test -- --coverage
  ```

  To test all the files, run:

  ```command
  cd signature_detection_app/frontend
  npm test -- --watchAll=false --coverage
  ```

- backend:

  I uses `pytest` and `coverage` for backend testing.

  To see the test coverage, run:

  ```command
  cd signature_detection_app/frontend
  source backend-coverage.sh 
  ```

## Future reading

If you are interested in how this project is created, you can check the article I wrote, [Innovation project: from Lab to Production](https://liujijieseason.medium.com/innovation-project-from-lab-to-production-5232e88bd6fa).

If you want to know more about the signature detection algorithm, there is a repo I created, [signature_detection](https://github.com/EnzoSeason/signature_detection). It includes the explanations and Jupyter notebooks to play with.

If you want to use signature detection in your project, check this package, [signature-detect](https://pypi.org/project/signature-detect/). It supports the signature detection from both **images** and **PDF files**.