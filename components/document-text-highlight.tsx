import { Card } from "@/components/ui/card"

export function DocumentTextHighlight() {
  return (
    <Card className="p-6 border border-border/50 max-h-[300px] overflow-auto">
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <p>
          The paper discusses the results of a study which explored advanced learners of English engagement with their
          mobile devices to develop learning experiences that meet their needs and goals as foreign language learners.
          The data were collected from 20 students by means of a semi-structured interview.
        </p>

        <p>
          <span className="bg-yellow-200/30 dark:bg-yellow-900/30 px-1 rounded">
            Mobile devices, smartphones and tablet computers in particular, have generated a lot of interest among
            researchers in recent years
          </span>{" "}
          (Byrne & Diem, 2014). This is because the opportunities these new technologies may offer (e.g. individualized
          learning, the variety of mobile apps available, easy access to the internet) and/or the fact that they are
          increasingly more common among learners make them an important and potentially useful addition to formal and
          informal language learning.
        </p>

        <p>
          According to Benson (2011),{" "}
          <span className="bg-red-200/30 dark:bg-red-900/30 px-1 rounded">
            there has always been a connection between educational technologies and learner autonomy to the extent that
            they have often been intended for independent practice
          </span>
          . It should be noted, however, that this link and "future enquiry and practice into technology-mediated
          learner autonomy will need to be increasingly aligned to the tools, settings, and activities that are of
          significance to language learners" (Reinders & White, 2016, p. 151).
        </p>

        <p>
          Reinders and White (2016) further argue that as long as "the potential range of settings, tools, and
          experiences is now virtually limitless, individuals need to be increasingly adept at critical adaptive
          learning in order to benefit from and contribute effectively to those settings" (p. 151).
        </p>
      </div>
    </Card>
  )
}
