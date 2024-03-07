Important Files for different environments

/.env  [To avoid override for each environment, added in .gitignore. This process can be improved at later stage]

# NODE_ENV = "production" for Live.
# NODE_ENV = "beta" for Beta
# NODE_ENV = "development" for Dev




/config/config.json

# prodmongoconfig = MongoDB Live connection string along with database name
# betamongoconfig = MongoDB Beta connection string along with database name
# devmongoconfig = MongoDB Dev connection string along with database name

# const devAPI_URL="http://localhost:3000/"
# const betaAPI_URL="https://api.n3clouds.com/"
# const prodAPI_URL="http://transport-alb-1143143505.ap-south-1.elb.amazonaws.com/"