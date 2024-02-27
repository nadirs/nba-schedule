import { filter, forEach, includes, map, sortBy } from "lodash";
import * as React from "react";
import { useEffect, useState } from "react";

interface Game {
  gid: string;
  gcode: string;
  gdte: string;
  etm: string;
  gdtutc: string;
  utctm: string;
  h: GameTeam;
  v: GameTeam;
}

interface GameTeam {
  tid: number;
  re: string;
  ta: string;
  tn: string;
  tc: string;
  s: string;
}

interface Search {
  fullText?: string;
}

const getData = async (year = 2021) => {
  const url = `https://data.nba.com/data/10s/v2015/json/mobile_teams/nba/${year}/league/00_full_schedule.json`;
  const response = await fetch(url);
  const { lscd } = await response.json();
  const games: Game[] = [];

  forEach(lscd, ({ mscd }) => {
    forEach(mscd.g, (game) => {
      games.push(game);
    });
  });

  return sortBy(games, "etm");
};

export const App = (): JSX.Element => {
  const [data, setData] = useState([]);
  const [fetched, setFetched] = useState(false);
  const [search, setSearch] = useState({} as Search);
  const [today, setToday] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const fetchData = () => {
      getData().then((data) => {
        setData(data);
        setFetched(true);
        console.log(data);
      });
    };
    fetchData();
  }, [today]);

  const onTeamFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch((search) => {
      return { ...search, fullText: e.target.value };
    });
  };

  let games = search.fullText
    ? filter(data, (g: Game) =>
        includes(
          [g.h.ta, g.h.tn, g.h.tc, g.v.ta, g.v.tn, g.v.tc],
          search.fullText
        )
      )
    : data;

  return (
    <div>
      <p>
        <label htmlFor="team_filter">
          Filter by team:{" "}
          <input name="team_filter" type="text" onChange={onTeamFilter} />
        </label>
      </p>
      <p>
        <a href={`#${today}`}>Go to Today</a>
      </p>
      {fetched ? (
        map(games, (game) => <Game key={game.gid} game={game} today={today} />)
      ) : (
        <p>Fetching Games...</p>
      )}
    </div>
  );
};

interface GameProps {
  game: Game;
  today: string;
}

export const Game = ({ game, today }: GameProps): JSX.Element => {
  return (
    <div className="game">
      <span
        id={game.gdtutc}
        style={{
          color:
            game.gdtutc < today
              ? "gray"
              : game.gdtutc == today
              ? "red"
              : "black",
        }}
      >
        [{game.gdtutc} {game.utctm}]{" "}
      </span>
      <strong>
        {game.v.ta}@{game.h.ta}
      </strong>
    </div>
  );
};
