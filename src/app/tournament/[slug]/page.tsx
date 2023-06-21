import Link from "next/link";
import TournamentSummary from "@/components/TournamentSummary";
import TossupCategoryTable from "@/components/TossupCategoryTable";
import Layout from "@/components/Layout";
import { getQuestionSetQuery, getTossupCategoryStatsQuery, getTournamentBySlugQuery, getTournamentsQuery } from "@/utils/queries";
import { Metadata } from "next";
import { QuestionSet, TossupCategory, Tournament } from "@/types";

export async function generateStaticParams() {
    const tournaments = getTournamentsQuery.all() as Tournament[];

    return tournaments.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    let tournament = getTournamentBySlugQuery.get(params.slug) as Tournament;

    return {
        title: `${tournament.name} - Buzzpoints App`,
        description: `Category conversion data for ${tournament!.name}`,
    };
}

export default function Tournament({ params }: { params: { slug: string } }) {
    const tournament = getTournamentBySlugQuery.get(params.slug) as Tournament;
    const questionSet = getQuestionSetQuery.get(tournament.question_set_id) as QuestionSet;
    const tossupCategoryStats = getTossupCategoryStatsQuery.all(tournament.id) as TossupCategory[];
    //const bonusCategoryStats = getBonusCategoryStatsQuery.all(tournament.id) as BonusCategory[];

    return (
        <Layout tournament={tournament}>
            <TournamentSummary
                tournament={{
                    ...tournament,
                    question_set: questionSet
                }}
            />
            <div className="flex sm-flex-column md-flex-row md-space-x-10">
                <div className="md-basis-1/2">
                    <h5 className="text-lg font-bold my-2">Tossups</h5>
                    <p className="mb-2"><Link href={`/tournament/${tournament.slug}/tossup`} className="underline">View all tossups</Link></p>
                    <TossupCategoryTable tossupCategoryStats={tossupCategoryStats} />
                </div>
                {/* <div className="md-basis-1/2">
                    <h5 className="text-lg font-bold my-2">Bonuses</h5>
                    <p className="mb-2"><Link href={`/tournament/${tournament.slug}/bonus`}>View all bonuses</Link></p>
                    <BonusCategoryTable bonusCategoryStats={tournament.bonusCategoryStats}/>
                </div> */}
            </div>
        </Layout>
    );
}