# Signature Detection App

A web application for signature detection.

It's based on the [signature_detection tool](https://github.com/EnzoSeason/signature_detection) I created.

There are 3 features.

- [detect the signature](###Detect-the-signature) in an image

- [correct the error](###Correct-the-error) in the detection result

- [add a signature](###Add-a-signature) to the result

In the end, user can download the result as a json file.

### Detect the signature

![detect](./img/detect.gif)

### Correct the error

![correct_error](./img/correct_error.gif)

### Add a signature

![add_signature](./img/add_signature.gif)

## Install

This application is shipped with Docker.

After downloading the codes, you can run it in 2 modes.

`dev` mode:

```command
cd signature_detection_app
docker-compose up
```

`production` mode:

```command
cd signature_detection_app
docker-compose -f docker-compose.yml up
```

That's all! The application is run at [localhost](http://localhost/).

## Structure

The application is composed by 3 parts.

- frontend

  It is created by [CRA (create-reat-app)](https://github.com/facebook/create-react-app), written by Typescript.

- backend

  It uses [Fastapi](https://github.com/tiangolo/fastapi), a Python web framework.

- web server

  It is Nginx. It proxys the requests.

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
  cd signature_detection_app
  source backend-coverage.sh 
  ```

## Future reading

- [Innovation project: from Lab to Production](https://liujijieseason.medium.com/innovation-project-from-lab-to-production-5232e88bd6fa)
  
   It's an article I wrote about how this project is created.

- [signature_detection Github repo](https://github.com/EnzoSeason/signature_detection)
  
  It's a Github repo I created that explains the **signature detection algorithm**. It also includes the Jupyter notebooks to play with.

- [signature-detect package](https://pypi.org/project/signature-detect/)

  It's a PyPI package of signature detection. It can detect the signature from both **images** and **PDF files**.
