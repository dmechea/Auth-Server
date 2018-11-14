LIGHTPURPLE='\033[1;35m'
LIGHTCYAN='\033[1;36m'
NC='\033[0m'

echo -e "${LIGHTCYAN}${NC}>>>>>>> ${LIGHTPURPLE}npm test initializing.....${NC}"
sleep 1
echo -e "${LIGHTCYAN}>${NC}>>>>>> ${LIGHTPURPLE}Beginning Test Suite.....${NC}"
sleep 1
echo -e "${LIGHTCYAN}>>${NC}>>>>> ${LIGHTPURPLE}Launching Redis.....${NC}"
sleep 1
redis-server &
sleep 2
echo -e "${LIGHTCYAN}>>>${NC}>>>> ${LIGHTPURPLE}Launching Express Testing Server.....${NC}"
node ./TestEnv/server.js &
npm_pid=$!
sleep 2 &&
echo -e "${LIGHTCYAN}>>>>${NC}>>> ${LIGHTPURPLE}Running Jest Tests.....${NC}"
sleep 1 &&
jest --detectOpenHandles &&
echo -e "${LIGHTCYAN}>>>>>${NC}>> ${LIGHTPURPLE}Shutting Down Express Testing Server.....${NC}"
kill $npm_pid &&
sleep 1 &&
echo -e "${LIGHTCYAN}>>>>>>${NC}> ${LIGHTPURPLE}Shutting Down Redis.....${NC}"
sleep 1 &&
redis-cli shutdown
echo -e "${LIGHTCYAN}>>>>>>>${NC} ${LIGHTPURPLE}Testing Complete${NC}"
